import { Query, Resolver } from '@nestjs/graphql';
import { Products } from 'src/storefront/models/products/products.model';
import { ProductsService } from 'src/storefront/services/products/products.service';

@Resolver(() => Products)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => Products)
  async products(): Promise<Products> {
    return this.productsService.products();
  }
}
