import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';
import * as cookieParser from 'cookie-parser';
import { CONSTANTS } from './constants';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { server, clientUrl } = app.get(ConfigsService);

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
