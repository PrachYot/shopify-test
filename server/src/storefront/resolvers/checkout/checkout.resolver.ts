import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Checkout } from 'src/storefront/models/checkout/checkout.model';
import { CheckoutService } from 'src/storefront/services/checkout/checkout.service';
import { CheckoutCreateInput } from 'src/storefront/inputs/checkout/checkoutCreate.input';

@Resolver(() => Checkout)
export class CheckoutResolver {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Mutation(() => Checkout)
  async checkoutCreate(
    @Args('checkoutCreateData', { type: () => CheckoutCreateInput })
    checkoutCreateData: CheckoutCreateInput,
  ): Promise<Checkout> {
    return this.checkoutService.checkoutCreate(checkoutCreateData);
  }

  @Mutation(() => Checkout)
  async checkoutCustomerAssociateV2(
    @Args('checkoutId') checkoutId: string,
    @Args('customerAccessToken') customerAccessToken: string,
  ): Promise<Checkout> {
    return this.checkoutService.checkoutCustomerAssociateV2(checkoutId, customerAccessToken);
  }

  @Mutation(() => Checkout)
  async checkoutCompleteFree(@Args('checkoutId') checkoutId: string): Promise<Checkout> {
    return this.checkoutService.checkoutCompleteFree(checkoutId);
  }
}
