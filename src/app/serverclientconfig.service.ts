import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import generator, { detector, OAuth } from 'megalodon';
import { MongoService } from './mongo.service';

export interface ServerClientConfig extends OAuth.AppDataFromServer {
    baseurl: string
    authurl: string
    sns: 'mastodon' | 'pleroma' | 'misskey' | 'friendica'
    created?: Date
}

@Injectable()
export class ServerClientConfigService {
    private collection: any
    private appName: string
    private website: string

    constructor(
        mongoService: MongoService,
        configService: ConfigService
    ) {
        const mongoClient = mongoService.getClient()
        this.collection = mongoClient.db().collection("servers")
        this.appName = configService.get('APP_NAME')
        this.website = configService.get('WEBSITE')
    }

    async getServerClientConfig(baseurl: string): Promise<ServerClientConfig> {
        // first try fetching it from MongoDB
        let config = await this.getServerConfigFromDatabase(baseurl)
        if (config === null) {
            // this should all be inside a transaction ideally - if two people attempt to
            // log in from the same brand new server at the same time this will fail for one of them
            // (as there should be a unique index on 'url' within the MongoDB collection)
            // Feels like this is a very unlikely scenario - the failed user just has to try again
            // so I'm not going to over-engineer this.
            config = await this.registerNewApp(baseurl)
            await this.saveServerConfigToDatabase(config)
        }

        return config
    }

    private async registerNewApp(baseurl: string): Promise<ServerClientConfig> {
        const sns = await detector(baseurl)
        const client = generator(sns, baseurl)

        const appData = await client.registerApp(this.appName, {
            redirect_uris: this.website + '/app/auth',
            scopes: ["read:follows", "write:follows"],
            website: this.website
        })

        const config =  {
            baseurl: baseurl,
            authurl: appData.url,
            sns: sns,
            created: new Date(),

            id: appData.id,
            name: appData.name,
            website: appData.website,
            redirect_uri: appData.redirect_uri,
            client_id: appData.client_id,
            client_secret: appData.client_secret
        } as ServerClientConfig

        return config
    }

    private async getServerConfigFromDatabase(baseurl: string): Promise<(ServerClientConfig | null)> {
        return  (await this.collection.findOne({"baseurl": baseurl})) as (ServerClientConfig | null)
    }

    private async saveServerConfigToDatabase(config: ServerClientConfig): Promise<void> {
        await this.collection.insertOne(config)
    }
}
