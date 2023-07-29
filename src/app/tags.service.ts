import { Injectable } from '@nestjs/common';
import { ServerClientConfigService } from './serverclientconfig.service';
import generator, { Response } from 'megalodon';

export interface Tag {
    name: string
    url: string
    weeklyUsage: number
}


@Injectable()
export class TagsService {

    constructor(private readonly serverClientConfigService: ServerClientConfigService) { }


    private parseTagResponse(tagResponse: Response<Entity.Tag[]>): Tag[] {
        const data = tagResponse.data
        return data.map((tagEntry: any) => {
            let weeklyUsage = 0
            tagEntry.history.forEach((historyEntry: any) => {
                weeklyUsage += parseInt(historyEntry.uses)
            })
            return {
                "name": tagEntry.name as string,
                "url": tagEntry.url as string,
                "weeklyUsage": weeklyUsage
            } as Tag
        })
    }

    async getFollowedTags(serverHost: string, accessToken: string): Promise<Tag[]> {
        const config = await this.serverClientConfigService.getServerClientConfig(serverHost)
        const client = generator(config.sns, serverHost, accessToken);
        const tagResponse = await client.getFollowedTags();
        return this.parseTagResponse(tagResponse)
    }

    async unfollowTag(serverHost: string, accessToken: string, tag: string): Promise<void> {
        const config = await this.serverClientConfigService.getServerClientConfig(serverHost)
        const client = generator(config.sns, serverHost, accessToken);
        await client.unfollowTag(tag);
    }
}