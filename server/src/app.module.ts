import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorefrontModule } from './storefront/storefront.module';

@Module({
  imports: [StorefrontModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
