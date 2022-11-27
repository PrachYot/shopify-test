import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/service/configs.service';
import * as cookieParser from 'cookie-parser';
import { CONSTANTS } from './constants';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import Shopify, { ApiVersion } from '@shopify/shopify-api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { server, clientUrl, shopify } = app.get(ConfigsService);

  // Setup Shopify context
  Shopify.Context.initialize({
    API_KEY: shopify.apiKey,
    API_SECRET_KEY: shopify.apiSecretKey,
    SCOPES: [...shopify.scopes.split(',').map((value) => value.trim())],
    HOST_NAME: shopify.host,
    HOST_SCHEME: shopify.hostSchema,
    IS_EMBEDDED_APP: false,
    API_VERSION: ApiVersion.October22,
  });

  // CORS
  const corsOption: CorsOptions = CONSTANTS.enableCors
    ? {
        origin: clientUrl ? [...clientUrl.split(',')] : [],
        credentials: true,
      }
    : {};

  app.enableCors(corsOption);
  app.use(cookieParser());

  // Set global prefix
  app.setGlobalPrefix(CONSTANTS.globalPrefix + CONSTANTS.apiVersion);

  await app.listen(server.port);
}
bootstrap();
