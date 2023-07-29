import { Test, TestingModule } from '@nestjs/testing';
import { ServerClientConfigService } from './serverclientconfig.service';
import { MongoService } from './mongo.service';
import { ConfigModule } from '@nestjs/config';

describe('ServerClientConfigService', () => {
  let serverClientConfigService: ServerClientConfigService;
  let mongoService : MongoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [],
      providers: [
        MongoService,
        ServerClientConfigService
      ],
    }).compile();

    serverClientConfigService = app.get<ServerClientConfigService>(ServerClientConfigService);
    mongoService = app.get<MongoService>(MongoService);
  });

  afterEach(async () => {
    mongoService.onModuleDestroy();
  })

  describe('root', () => {
    it('should return a server config"', async () => {
      const config  = await serverClientConfigService.getServerClientConfig('https://mastodon.online')
      expect(config.authurl).toBeDefined();
      expect(config.client_id).toBeDefined();
      expect(config.client_secret).toBeDefined();
    });
  });
});
