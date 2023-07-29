import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './app/auth.controller';
import { AuthService } from './app/auth.service';
import { MongoService } from './app/mongo.service';
import { ServerClientConfigService } from './app/serverclientconfig.service';
import { TagsService } from './app/tags.service';
import { TagsController } from './app/tags.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [
    AuthController,
    TagsController
  ],
  providers: [
    AuthService,
    MongoService,
    ServerClientConfigService,
    TagsService
  ],
})
export class AppModule { }
