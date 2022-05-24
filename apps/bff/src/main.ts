/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { AuthRoutes } from './app/auth/constants';
import { UnauthorizedExceptionFilter } from './app/auth/unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      {
        path: AuthRoutes.SigninOidc,
        method: RequestMethod.GET,
      },
      {
        path: AuthRoutes.SignoutOidc,
        method: RequestMethod.GET,
      },
      {
        path: AuthRoutes.BackchannelLogout,
        method: RequestMethod.POST,
      },
    ],
  });

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  const port = process.env.PORT || 3000;

  app.use(cookieParser());

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
