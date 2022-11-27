import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CustomerCreateInput } from 'src/storefront/inputs/customer/customerCreate.input';
import { Customer } from 'src/storefront/models/customer/customer.model';
import { CustomerService } from 'src/storefront/services/customer/customer.service';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customersService: CustomerService) {}

  @Mutation(() => Customer)
  async customerCreate(
    @Args('customerCreateData', { type: () => CustomerCreateInput })
    customerCreateData: CustomerCreateInput,
  ): Promise<Customer> {
    return this.customersService.customerCreate(customerCreateData);
  }
}
