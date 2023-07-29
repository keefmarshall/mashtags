import { Controller, Delete, Get, Param, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Tag, TagsService } from './tags.service';

@Controller()
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get("/app/tags")
    @Render("tags")
    async getTags(@Req() request: Request, @Res() response: Response) {
        const serverHost = request.session["serverHost"]
        const accessToken = request.session["accessToken"]
        try {
            const tags = await this.tagsService.getFollowedTags(serverHost, accessToken)
            return { "tags": tags }
        } catch (e) {
            response.redirect("/?error")
        }
    }

    @Delete("/app/tags/:tag")
    async unfollowTag(
        @Param("tag") tag: string, 
        @Req() request: Request
    ): Promise<void> {
        const serverHost = request.session["serverHost"]
        const accessToken = request.session["accessToken"]
        await this.tagsService.unfollowTag(serverHost, accessToken, tag)
        return
    }
}
