import { Response } from "megalodon";
import { extractLinks } from "./links";


function buildResponse(link?: string): Response {
    return {
        data: {},
        headers: link ? { Link: link } : {},
        status: 200,
        statusText: "OK"
    };
}

describe('extractLinks', () => {
    it('should return an empty map if no links are present', () => {
        const response = buildResponse();
        const result = extractLinks(response);
        expect(result).toEqual({});
    });

    it('should return a map of links if links are present', () => {
        const response = buildResponse('<https://mastodon.example/api/v1/endpoint?max_id=7163058>; rel="next", <https://mastodon.example/api/v1/endpoint?since_id=7275607>; rel="prev"')
        const result = extractLinks(response);
        expect(result).toEqual({
            'next': 'https://mastodon.example/api/v1/endpoint?max_id=7163058',
            'prev': 'https://mastodon.example/api/v1/endpoint?since_id=7275607'
        });
    });

    it('should handle a single link', () => {
        const response = buildResponse('<https://mastodon.online/api/v1/followed_tags?since_id=47085>; rel="prev"')
        const result = extractLinks(response);
        expect(result).toEqual(
            { 'prev': 'https://mastodon.online/api/v1/followed_tags?since_id=47085' }
        );
    });
});