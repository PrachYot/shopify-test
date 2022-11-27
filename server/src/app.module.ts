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
import { CartResolver } from './storefront/resolvers/cart/cart.resolver';
import { CartService } from './storefront/services/cart/cart.service';
import { StorefrontService } from './storefront/services/storefront/storefront.service';
import { CustomerResolver } from './storefront/resolvers/customer/customer.resolver';
import { CustomerService } from './storefront/services/customer/customer.service';
import { CustomerTokenResolver } from './storefront/resolvers/customer-token/customer-token.resolver';
import { CustomerTokenService } from './storefront/services/customer-token/customer-token.service';

@Module({
  imports: [
    ConfigsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigsModule],
      useFactory: (configsService: ConfigsService) => {
        const { clientUrl } = configsService;

        return {
          cors: CONSTANTS.enableCors
            ? {
                origin: clientUrl ? [...clientUrl.split(',')] : [],
                credentials: true,
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
  providers: [
    AppService,
    ProductsResolver,
    ProductsService,
    CartResolver,
    CartService,
    StorefrontService,
    CustomerResolver,
    CustomerService,
    CustomerTokenResolver,
    CustomerTokenService,
  ],
})
export class AppModule {}
