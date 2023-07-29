
## Description

Mashtags - allow viewing and deleting followed tags in Mastodon.

## Infrastructure

Requires a MongoDB instance to store app client IDs and session data.

See [INFRA](INFRA.md) for details.

## Installation

```bash
$ npm install
```

## Configuration

Copy `.env.sample` to `.env` and edit the properties accordingly. 
Be sure to set a secure session secret.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

MIT licensed.

Includes Simple CSS (c) Kev Quirk (also MIT licensed).
