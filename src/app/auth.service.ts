import { Injectable } from '@nestjs/common';
import generator from 'megalodon'
import { ServerClientConfigService } from './serverclientconfig.service';

@Injectable()
export class AuthService {

    constructor(private readonly serverClientConfigService: ServerClientConfigService) { }

    async getAccessTokenFromAuthCode(code: string, serverHost: string): Promise<string> {
        const config = await this.serverClientConfigService.getServerClientConfig(serverHost)
        const client = generator(config.sns, serverHost);
        const tokenData = await client.fetchAccessToken(
            config.client_id, config.client_secret, code, config.redirect_uri)
        return tokenData.accessToken
    }
}
