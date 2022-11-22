import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';
import * as cookieParser from 'cookie-parser';
import { CONSTANTS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { server, clientUrl } = app.get(ConfigsService);

  // CORS
  // const corsOption: CorsOptions = {
  //   origin: clientUrl,
  //   credentials: true,
  // };

  // app.enableCors(corsOption);
  app.use(cookieParser());

  // Set global prefix
  app.setGlobalPrefix(CONSTANTS.globalPrefix + CONSTANTS.apiVersion);

  await app.listen(server.port);
}
bootstrap();
