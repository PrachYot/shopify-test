import { Mutation, Resolver } from '@nestjs/graphql';
import { Cart } from 'src/storefront/models/cart/cart.model';
import { CartService } from 'src/storefront/services/cart/cart.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async cartCreate(): Promise<void> {
    return this.cartService.cartCreate();
  }
}
