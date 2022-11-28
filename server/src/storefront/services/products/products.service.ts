import { Injectable } from '@nestjs/common';
import { Products } from 'src/storefront/models/products/products.model';
import { StorefrontService } from '../storefront/storefront.service';

@Injectable()
export class ProductsService {
  constructor(private storefrontService: StorefrontService) {}

  async products(): Promise<Products> {
    const client = this.storefrontService.client();

    const foundProducts = await client
      .query<any>({
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
              images(first: 100) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    priceV2 {
                      amount
                    }
                    image {
                      url
                    }
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                  hasPreviousPage
                  startCursor
                }
              }
              metafields(identifiers: {namespace: "custom", key: "add_on_espresso_shot"}) {
                id
                key
                value
                namespace
              }
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
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!foundProducts || !foundProducts.body || !foundProducts.body.data) {
      throw new Error('No products found');
    }

    const { products } = foundProducts.body.data;

    return products;
  }
}
