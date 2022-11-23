import { Injectable } from '@nestjs/common';
import Shopify from '@shopify/shopify-api';
import { ConfigsService } from 'src/configs/service/configs.service';
import { Products } from 'src/storefront/models/products/products.model';

@Injectable()
export class ProductsService {
  constructor(private configsService: ConfigsService) {}

  async products(): Promise<Products> {
    const { shopify } = this.configsService;

    const storefrontAccessToken = shopify.storefrontAccessToken;

    const client = new Shopify.Clients.Storefront(shopify.shop, storefrontAccessToken);

    const foundProducts = await client.query<any>({
      data: `{
        products(first: 100) {
          edges {
            cursor
            node {
              availableForSale
              description
              id
              tags
              title
              totalInventory
              updatedAt
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }`,
    });

    if (!foundProducts || !foundProducts.body || !foundProducts.body.data) {
      throw new Error('No products found');
    }

    const { products } = foundProducts.body.data;

    return products;
  }
}
