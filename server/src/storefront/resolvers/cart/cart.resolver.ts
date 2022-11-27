import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartLineInput } from 'src/storefront/inputs/card-line/cartLine.input';
import { CartLineUpdateInput } from 'src/storefront/inputs/card-line/cartLineUpdate.input';
import { Cart } from 'src/storefront/models/cart/cart.model';
import { CartService } from 'src/storefront/services/cart/cart.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async cartCreate(): Promise<Cart> {
    return this.cartService.cartCreate();
  }

  @Query(() => Cart)
  async cart(@Args('cartId', { type: () => String }) cartId: string): Promise<Cart> {
    return this.cartService.cart(cartId);
  }

  @Mutation(() => Cart)
  async cartLinesAdd(
    @Args('cartId', { type: () => String }) cartId: string,
    @Args('cartLineData', { type: () => [CartLineInput] }) cartLineData: CartLineInput[],
  ): Promise<Cart> {
    return this.cartService.cartLinesAdd(cartId, cartLineData);
  }

  @Mutation(() => Cart)
  async cartLinesUpdate(
    @Args('cartId', { type: () => String }) cartId: string,
    @Args('cartLineUpdateData', { type: () => [CartLineUpdateInput] })
    cartLineUpdateData: CartLineUpdateInput[],
  ): Promise<Cart> {
    return this.cartService.cartLinesUpdate(cartId, cartLineUpdateData);
  }

  @Mutation(() => Cart)
  async cartLinesRemove(
    @Args('cartId', { type: () => String }) cartId: string,
    @Args('lineIds', { type: () => [String] }) lineIds: string[],
  ): Promise<Cart> {
    return this.cartService.cartLinesRemove(cartId, lineIds);
  }
}
