import { Injectable } from '@nestjs/common';
import { CheckoutCreateInput } from 'src/storefront/inputs/checkout/checkoutCreate.input';
import { Checkout } from 'src/storefront/models/checkout/checkout.model';
import { StorefrontService } from '../storefront/storefront.service';

@Injectable()
export class CheckoutService {
  constructor(private storefrontService: StorefrontService) {}

  async checkoutCreate(checkoutCreateData: CheckoutCreateInput): Promise<Checkout> {
    const client = this.storefrontService.client();

    const createdCheckout = await client
      .query<any>({
        data: {
          query: `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
              checkoutCreate(input: $input) {
                checkout {
                  id
                  customAttributes {
                    key
                    value
                  }
                  email
                  lineItemsSubtotalPrice {
                    amount
                  }
                  note
                  ready
                  subtotalPrice {
                    amount
                  }
                  totalPrice {
                    amount
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        id
                        quantity
                        customAttributes {
                          key
                          value
                        }
                        title
                        unitPrice {
                          amount
                        }
                        variant {
                          id
                          title
                          priceV2 {
                            amount
                          }
                          image {
                            url
                          }
                          product {
                            id
                            title
                            metafields(identifiers: {namespace: "custom", key: "add_on_espresso_shot"}) {
                              id
                              key
                              value
                              namespace
                            }
                          }
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: checkoutCreateData,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!createdCheckout || !createdCheckout.body || !createdCheckout.body.data) {
      throw new Error('Unable to create checkout');
    }

    const { checkoutCreate } = createdCheckout.body.data;

    return checkoutCreate.checkout;
  }

  async checkoutCustomerAssociateV2(
    checkoutId: string,
    customerAccessToken: string,
  ): Promise<Checkout> {
    const client = this.storefrontService.client();

    const associatedCheckout = await client
      .query<any>({
        data: {
          query: `
            mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
              checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
                checkout {
                  id
                  customAttributes {
                    key
                    value
                  }
                  email
                  lineItemsSubtotalPrice {
                    amount
                  }
                  note
                  ready
                  subtotalPrice {
                    amount
                  }
                  totalPrice {
                    amount
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        id
                        quantity
                        customAttributes {
                          key
                          value
                        }
                        title
                        unitPrice {
                          amount
                        }
                        variant {
                          id
                          title
                          priceV2 {
                            amount
                          }
                          image {
                            url
                          }
                          product {
                            id
                            title
                            metafields(identifiers: {namespace: "custom", key: "add_on_espresso_shot"}) {
                              id
                              key
                              value
                              namespace
                            }
                          }
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                  }
                }
              }
            }
          `,
          variables: {
            checkoutId,
            customerAccessToken,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!associatedCheckout || !associatedCheckout.body || !associatedCheckout.body.data) {
      throw new Error('Unable to associate customer with checkout');
    }

    const { checkoutCustomerAssociateV2 } = associatedCheckout.body.data;

    return checkoutCustomerAssociateV2.checkout;
  }

  async checkoutCompleteFree(checkoutId: string): Promise<Checkout> {
    const client = this.storefrontService.client();

    const completedCheckout = await client
      .query<any>({
        data: {
          query: `
            mutation checkoutCompleteFree($checkoutId: ID!) {
              checkoutCompleteFree(checkoutId: $checkoutId) {
                checkout {
                  id
                  customAttributes {
                    key
                    value
                  }
                  email
                  lineItemsSubtotalPrice {
                    amount
                  }
                  note
                  ready
                  subtotalPrice {
                    amount
                  }
                  totalPrice {
                    amount
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        id
                        quantity
                        customAttributes {
                          key
                          value
                        }
                        title
                        unitPrice {
                          amount
                        }
                        variant {
                          id
                          title
                          priceV2 {
                            amount
                          }
                          image {
                            url
                          }
                          product {
                            id
                            title
                            metafields(identifiers: {namespace: "custom", key: "add_on_espresso_shot"}) {
                              id
                              key
                              value
                              namespace
                            }
                          }
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                  }
                }
              }
            }
          `,
          variables: {
            checkoutId,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!completedCheckout || !completedCheckout.body || !completedCheckout.body.data) {
      throw new Error('Unable to complete checkout');
    }

    const { checkoutCompleteFree } = completedCheckout.body.data;

    return checkoutCompleteFree.checkout;
  }
}
