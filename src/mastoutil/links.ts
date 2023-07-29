import { Response } from "megalodon";

/*
    The Mastodon API's Link header looks like this:

    Link: <https://mastodon.example/api/v1/endpoint?max_id=7163058>; rel="next", <https://mastodon.example/api/v1/endpoint?since_id=7275607>; rel="prev"

    The links will be returned all via one Link header, separated by a comma and a space (, )
    Each link consists of a URL and a link relation, separated by a semicolon and a space (; )
    The URL will be surrounded by angle brackets (<>), and the link relation will be surrounded by double quotes ("") and prefixed with rel=.
    The value of the link relation will be either prev or next.
*/

export interface Links {
    [key: string]: string
}

export function extractLinks(response: Response): Links {
    const linksHeader = response.headers["link"] || response.headers["Link"]
    if (!linksHeader) {
        return {}
    }

    const links = {}
    linksHeader.split(", ").forEach((link) => {
        const parts = link.split("; ")
        const rel = parts[1].replace("rel=", "").replaceAll("\"", "").trim()
        const url = parts[0].replace("<", "").replace(">", "").trim()
        links[rel] = url
    })

    return links
}