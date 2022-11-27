import { Injectable } from '@nestjs/common';
import { CustomerCreateInput } from 'src/storefront/inputs/customer/customerCreate.input';
import { Customer } from 'src/storefront/models/customer/customer.model';
import { StorefrontService } from '../storefront/storefront.service';

@Injectable()
export class CustomerService {
  constructor(private storefrontService: StorefrontService) {}

  async customerCreate(customerCreateData: CustomerCreateInput): Promise<Customer> {
    const { firstName, lastName, email, password, passwordConfirmation, phone, acceptsMarketing } =
      customerCreateData;

    if (password !== passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    const client = this.storefrontService.client();

    const createdCustomer = await client
      .query<any>({
        data: {
          query: `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                id
                firstName
                lastName
                email
                phone
                acceptsMarketing
                displayName
              }
            }
          }
        `,
          variables: {
            input: {
              firstName,
              lastName,
              email,
              phone,
              password,
              acceptsMarketing,
            },
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!createdCustomer || !createdCustomer.body || !createdCustomer.body.data) {
      throw new Error('No customer created');
    }

    const { customerCreate } = createdCustomer.body.data;

    return customerCreate.customer;
  }
}
