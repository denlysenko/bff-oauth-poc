import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issuer } from 'openid-client';
import { createClient } from 'redis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisTokenStorage } from './redis-token-storage';
import { TokenStorage } from './token-storage';
import { AuthRoutes } from './constants';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: TokenStorage,
      useFactory: (configService: ConfigService) => {
        const url = configService.get('REDIS_URL');
        const client = createClient({ url });
        return new RedisTokenStorage(client);
      },
      inject: [ConfigService],
    },
    {
      provide: AuthService,
      useFactory: async (
        configService: ConfigService,
        storage: TokenStorage
      ) => {
        const host = configService.get('HOST');
        const port = configService.get('PORT');

        const { Client } = await Issuer.discover(
          configService.get('ISSUER_URL')
        );

        const client = new Client({
          client_id: configService.get('CLIENT_ID'),
          client_secret: configService.get('CLIENT_SECRET'),
          redirect_uris: [`${host}:${port}/${AuthRoutes.SigninOidc}`],
          response_types: ['code'],
        });

        return new AuthService(client, storage, configService);
      },
      inject: [ConfigService, TokenStorage],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
