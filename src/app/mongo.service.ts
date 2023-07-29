import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb'

@Injectable()
export class MongoService {
  private mongoClient: MongoClient

  constructor(
    private readonly configService: ConfigService
  ) {
    this.mongoClient = new MongoClient(configService.get('MONGO_URI'))
  }

  getClient(): MongoClient {
    return this.mongoClient;
  }

  onModuleDestroy() {
    console.log("Closing mongo client")
    this.mongoClient.close()
  }
}
