import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
