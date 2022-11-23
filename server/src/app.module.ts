import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/configs.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigsService } from './configs/service/configs.service';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { CONSTANTS } from './constants';
import { ProductsResolver } from './storefront/resolvers/products/products.resolver';
import { ProductsService } from './storefront/services/products/products.service';

@Module({
  imports: [
    ConfigsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigsModule],
      useFactory: (configsService: ConfigsService) => {
        return {
          cors: CONSTANTS.enableCors
            ? {
                origin: configsService.clientUrl,
                credential: true,
              }
            : {},
          debug: false,
          playground: false,
          plugins:
            configsService.nodeEnv === 'production'
              ? []
              : [ApolloServerPluginLandingPageLocalDefault()],
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          context: ({ req, res }) => ({ req, res }),
        };
      },
      inject: [ConfigsService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ProductsResolver, ProductsService],
})
export class AppModule {}
