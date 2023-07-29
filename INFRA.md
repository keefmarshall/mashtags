## SERVICE DEPENDENCIES

You'll need MongoDB available - for local dev I use Docker:

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

We may also want to create an expiring index on the `sessions` collection manually - if so,
make sure that `autoRemove: "disabled"` is set in the session MongoStore options.

```
db.sessions.createIndex( { "expires": 1 }, { expireAfterSeconds: 0 } )
```

We definitely want a unique index on `baseurl`  in the `servers` collection, 
so we don't get duplicate app registrations:

```
db.servers.createIndex( { "baseurl": 1 }, { unique: true} )
```
