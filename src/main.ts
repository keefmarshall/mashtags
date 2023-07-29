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
    app.use(helmet({
        contentSecurityPolicy: false
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
