## SERVICE DEPENDENCIES

You'll need MongoDB available - for local dev you can use Docker:

```
docker run --name masto-mongo \
 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
 -e MONGO_INITDB_ROOT_PASSWORD=secret \
 -p 27017:27017 -d mongo
```

Log into the MongoDB command line with the above admin credentials (or use MongoDB Compass).

Create a user for the app, with `readWrite` permissions on the database (this will prompt for
the new user's password)

```
use mastotags
db.createUser(
    {
        user: "mastotags",
        pwd: passwordPrompt(),
        roles: [
            { role: "readWrite", db: "mastotags" },
        ]
    }
)
```

We want a unique index on `baseurl`  in the `servers` collection, 
so we don't get duplicate app registrations:

```
db.servers.createIndex( { "baseurl": 1 }, { unique: true} )
```
