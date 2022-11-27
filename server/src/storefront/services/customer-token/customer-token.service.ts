import { Injectable } from '@nestjs/common';
import { CustomerAccessTokenCreateInput } from 'src/storefront/inputs/customer-token/customerAccessTokenCreate.input';
import { CustomerToken } from 'src/storefront/models/customer-token/customerToken.model';
import { StorefrontService } from '../storefront/storefront.service';

@Injectable()
export class CustomerTokenService {
  constructor(private storefrontService: StorefrontService) {}

  async customerAccessTokenCreate(
    customerAccessTokenCreateData: CustomerAccessTokenCreateInput,
  ): Promise<CustomerToken> {
    const { email, password } = customerAccessTokenCreateData;

    const client = this.storefrontService.client();

    const createdCustomerAccessToken = await client
      .query<any>({
        data: {
          query: `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) {
                customerAccessToken {
                  accessToken
                  expiresAt
                }
              }
            }
          `,
          variables: {
            input: {
              email,
              password,
            },
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (
      !createdCustomerAccessToken ||
      !createdCustomerAccessToken.body ||
      !createdCustomerAccessToken.body.data
    ) {
      throw new Error('Error creating customer access token');
    }

    const { customerAccessTokenCreate } = createdCustomerAccessToken.body.data;

    if (!customerAccessTokenCreate) {
      throw new Error('Error creating customer access token');
    }

    const { customerAccessToken } = customerAccessTokenCreate;

    return {
      customerAccessToken: {
        accessToken: customerAccessToken.accessToken,
        expiresAt: new Date(customerAccessToken.expiresAt),
      },
    };
  }
}
