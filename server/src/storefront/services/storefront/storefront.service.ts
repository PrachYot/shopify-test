import { Injectable } from '@nestjs/common';
import Shopify from '@shopify/shopify-api';
import { StorefrontClient } from '@shopify/shopify-api/dist/clients/graphql/storefront_client';
import { ConfigsService } from 'src/configs/service/configs.service';

@Injectable()
export class StorefrontService {
  constructor(private configsService: ConfigsService) {}

  client(): StorefrontClient {
    const { shopify } = this.configsService;

    const storefrontAccessToken = shopify.storefrontAccessToken;

    const client: StorefrontClient = new Shopify.Clients.Storefront(
      shopify.shop,
      storefrontAccessToken,
    );

    return client;
  }
}
