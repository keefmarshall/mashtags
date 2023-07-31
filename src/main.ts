import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { MongoService } from './app/mongo.service';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get<ConfigService>(ConfigService);
    const mongoService = app.get<MongoService>(MongoService);
    app.enableShutdownHooks();

    const cspDirectives = helmet.contentSecurityPolicy.getDefaultDirectives()
    // cspDirectives['script-src'] = ["'self'", "'unsafe-inline'"] // unsafe-inline currently needed for onClick
    cspDirectives['frame-ancestors'] = ["'none'"] // defaults to 'same origin'
    cspDirectives['style-src'] = ["'self'"]
    cspDirectives["img-src"] = ["'self'"]
    cspDirectives["font-src"] = ["'self'"]
    if (configService.get("ENVIRONMENT") == "dev") {
        delete cspDirectives["upgrade-insecure-requests"] // for local development, non-TLS
    }

    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: cspDirectives
        },
        xFrameOptions: { action: "deny" }, // default is same origin
    }))
    app.set("trust proxy", 1); // so we can use secure cookies even though nginx is terminating SSL
    app.use(
        session({
            cookie: {
                secure: configService.get("ENVIRONMENT") == "dev" ? false : true,
                httpOnly: true,
                maxAge: 3600000
            },
            secret: configService.get('SESSION_SECRET'),
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                client: mongoService.getClient(),
                // autoRemove: 'disabled' // if you enable this, manually add TTL index
            })
        }),
    );

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');

    await app.listen(3000);
}
bootstrap();
