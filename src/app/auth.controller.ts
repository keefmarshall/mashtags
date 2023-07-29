import { Body, Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServerClientConfigService } from './serverclientconfig.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

class AuthUrlDTO {
    serverBaseUrl: string
}

@Controller("/app/auth")
export class AuthController {
    private redirectAfterAuth: string

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly serverClientConfigService: ServerClientConfigService
    ) { 
        this.redirectAfterAuth = configService.get('REDIRECT_AFTER_AUTH')
    }

    // This is the initial Post - the user must specify their Mastodon host
    // then we redirect them to the specific authorisation URL for that server
    // - the Mastodon server will then redirect them back to us, and will hit get() below
    @Post()
    async redirectToAuthorize(
        @Req() request: Request,
        @Res() response: Response,
        @Body() params: AuthUrlDTO
    ) {
        let urlString = params.serverBaseUrl
        if (!urlString.startsWith("https://")) {
            urlString = "https://" + urlString
        }

        // validate the URL a bit - take just the protocol and host:port
        let url: URL;
        try {
            url = new URL(urlString)
        } catch (e) {
            response.redirect("/")
            return
        }

        const serverHost = url.protocol + '//' + url.host

        // Save the Masto host for this session
        request.session["serverHost"] = serverHost

        const config = await this.serverClientConfigService.getServerClientConfig(serverHost)
        response.redirect(config.authurl) 
    }

    @Get()
    async getTokenFromAuthCode (
        @Query("code") code: string,
        @Req() request: Request,
        @Res() response: Response
    ) {
        const serverHost = request.session["serverHost"]
        const accessToken = await this.authService.getAccessTokenFromAuthCode(code, serverHost)
        request.session["accessToken"] = accessToken
        response.redirect(this.redirectAfterAuth)
    }
}
