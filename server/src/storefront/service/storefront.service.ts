import { Injectable } from '@nestjs/common';
import Shopify from '@shopify/shopify-api';
import { ConfigsService } from 'src/configs/service/configs.service';

@Injectable()
export class StorefrontService {
  constructor(private configsService: ConfigsService) {}

  async hello(): Promise<string> {
    const { shopify } = this.configsService;

    const storefrontAccessToken = shopify.storefrontAccessToken;

    const client = new Shopify.Clients.Storefront(shopify.shop, storefrontAccessToken);

    const foundProducts = await client.query<any>({
      data: `{
        products (first: 2) {
          edges {
            node {
              id
              title
              descriptionHtml
            }
          }
        }
      }`,
    });

    if (foundProducts) {
      console.log(foundProducts.body.data.products.edges);
    }

    return 'Hello World!';
  }
}
