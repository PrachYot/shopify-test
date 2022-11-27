import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CustomerAccessTokenCreateInput } from 'src/storefront/inputs/customer-token/customerAccessTokenCreate.input';
import { CustomerToken } from 'src/storefront/models/customer-token/customerToken.model';
import { CustomerTokenService } from 'src/storefront/services/customer-token/customer-token.service';

@Resolver(() => CustomerToken)
export class CustomerTokenResolver {
  constructor(private readonly customerTokenService: CustomerTokenService) {}

  @Mutation(() => CustomerToken)
  async customerAccessTokenCreate(
    @Args('customerAccessTokenCreateData', { type: () => CustomerAccessTokenCreateInput })
    customerAccessTokenCreateData: CustomerAccessTokenCreateInput,
  ): Promise<CustomerToken> {
    return this.customerTokenService.customerAccessTokenCreate(customerAccessTokenCreateData);
  }
}
