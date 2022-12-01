import { Body, Injectable } from '@nestjs/common';
import Shopify from '@shopify/shopify-api';
import { StorefrontClient } from '@shopify/shopify-api/dist/clients/graphql/storefront_client';
import { ConfigsService } from 'src/configs/service/configs.service';

@Injectable()
export class StorefrontService {
  constructor(private configsService: ConfigsService) {}

  client(): StorefrontClient {
    const { shopify } = this.configsService;

    const storefrontAccessToken = shopify.storefrontAccessToken;

    const client: StorefrontClient = new Shopify.Clients.Storefront(
      shopify.shop,
      storefrontAccessToken,
    );

    return client;
  }

  async customer(customerAccessToken: string): Promise<any> {
    const client = this.client();

    const foundCustomer = await client
      .query<any>({
        data: {
          query: `
            query Customer($customerAccessToken: String!) {
              customer(customerAccessToken: $customerAccessToken) {
                id
                email
                firstName
                lastName
                displayName
                phone
                acceptsMarketing
              }
            }
          `,
          variables: {
            customerAccessToken,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!foundCustomer || !foundCustomer.body || !foundCustomer.body.data) {
      throw new Error('No customer');
    }

    const { customer } = foundCustomer.body.data;

    return customer;
  }

  async customerCreate(@Body() body): Promise<any> {
    const { firstName, lastName, email, password, passwordConfirmation, phone, acceptsMarketing } =
      body;

    if (password !== passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    const client = this.client();

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

  async customerAccessTokenCreate(@Body() body): Promise<any> {
    const { email, password } = body;

    const client = this.client();

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

  async products(): Promise<any> {
    const client = this.client();

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

  private sumAmounts(amounts: any[]): string {
    const newAmount = amounts.reduce((sum, amount) => sum + Number(amount), 0);

    return newAmount.toString();
  }

  private cartAddOns(cart): any {
    let totalAddOns = 0;

    cart.lines.edges = cart.lines.edges.map((item) => {
      const { node } = item;
      const { attributes, cost } = node;
      const { amountPerQuantity, subtotalAmount, totalAmount } = cost;

      let addOns = 0;

      attributes.forEach((attr: { key: string; value: string }) => {
        if (attr.key === 'add_on_espresso_shot') {
          // 15฿ per shot
          addOns += parseInt(attr.value) * 15;
        }
      });

      // Update node.cost
      node.cost = {
        amountPerQuantity,
        subtotalAmount: {
          amount: this.sumAmounts([subtotalAmount.amount, addOns]),
        },
        totalAmount: {
          amount: this.sumAmounts([totalAmount.amount, addOns]),
        },
      };

      totalAddOns += addOns;

      return {
        item,
        node,
      };
    });

    // Update cart.cost
    cart.cost = {
      ...cart.cost,
      checkoutChargeAmount: {
        amount: this.sumAmounts([cart.cost.checkoutChargeAmount.amount, totalAddOns]),
      },
      subtotalAmount: {
        amount: this.sumAmounts([cart.cost.subtotalAmount.amount, totalAddOns]),
      },
      totalAmount: {
        amount: this.sumAmounts([cart.cost.totalAmount.amount, totalAddOns]),
      },
    };

    return cart;
  }

  async cart(@Body() body): Promise<any> {
    const { cartId } = body;

    const client = this.client();

    const foundCart = await client
      .query<any>({
        data: {
          query: `
            query cart($cartId: ID!) {
              cart(id: $cartId) {
                id
                checkoutUrl
                totalQuantity
                cost {
                  checkoutChargeAmount {
                    amount
                  }
                  subtotalAmount {
                    amount
                  }
                  totalAmount {
                    amount
                  }
                  totalTaxAmount {
                    amount
                  }
                }
                lines(first: 10) {
                  edges {
                    node {
                      id
                      quantity
                      cost {
                        amountPerQuantity {
                          amount
                        }
                        compareAtAmountPerQuantity {
                          amount
                        }
                        subtotalAmount {
                          amount
                        }
                        totalAmount {
                          amount
                        }
                      }
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          image {
                            url
                          }
                          product {
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
                      attributes {
                        key
                        value
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            cartId,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!foundCart || !foundCart.body || !foundCart.body.data) {
      throw new Error('No cart found');
    }

    const { cart } = foundCart.body.data;

    const result = this.cartAddOns(cart);

    return result;
  }

  async cartCreate(): Promise<any> {
    const client = this.client();

    const createdCart = await client
      .query<any>({
        data: {
          query: `
            mutation cartCreate {
              cartCreate {
                cart {
                  id
                }
              }
            }
          `,
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!createdCart || !createdCart.body || !createdCart.body.data) {
      throw new Error('No cart created');
    }

    const { cartCreate } = createdCart.body.data;

    return cartCreate.cart;
  }

  async cartLinesAdd(@Body() body): Promise<any> {
    const { cartId, cartLineData } = body;

    const client = this.client();

    const addedCartLines = await client
      .query<any>({
        data: {
          query: `
            mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
              cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                  id
                  checkoutUrl
                  totalQuantity
                  cost {
                    checkoutChargeAmount {
                      amount
                    }
                    subtotalAmount {
                      amount
                    }
                    totalAmount {
                      amount
                    }
                  }
                  lines(first: 10) {
                    edges {
                      node {
                        attributes {
                          key
                          value
                        }
                        id
                        quantity
                        cost {
                          amountPerQuantity {
                            amount
                          }
                          compareAtAmountPerQuantity {
                            amount
                          }
                          subtotalAmount {
                            amount
                          }
                          totalAmount {
                            amount
                          }
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
                }
              }
            }
          `,
          variables: {
            cartId,
            lines: cartLineData,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!addedCartLines || !addedCartLines.body || !addedCartLines.body.data) {
      throw new Error('No cart lines added');
    }

    const { cartLinesAdd } = addedCartLines.body.data;

    return cartLinesAdd.cart;
  }

  async cartLinesUpdate(@Body() body): Promise<any> {
    const { cartId, cartLineUpdateData } = body;

    const client = this.client();

    const updatedCartLines = await client
      .query<any>({
        data: {
          query: `
            mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
              cartLinesUpdate(cartId: $cartId, lines: $lines) {
                cart {
                  id
                  checkoutUrl
                  totalQuantity
                  cost {
                    checkoutChargeAmount {
                      amount
                    }
                    subtotalAmount {
                      amount
                    }
                    totalAmount {
                      amount
                    }
                  }
                  lines(first: 10) {
                    edges {
                      node {
                        id
                        quantity
                        cost {
                          amountPerQuantity {
                            amount
                          }
                          compareAtAmountPerQuantity {
                            amount
                          }
                          subtotalAmount {
                            amount
                          }
                          totalAmount {
                            amount
                          }
                        }
                        merchandise {
                          ... on ProductVariant {
                            id
                            title
                            image {
                              url
                            }
                            product {
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
                        attributes {
                          key
                          value
                        }
                      }
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            cartId,
            lines: cartLineUpdateData,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!updatedCartLines || !updatedCartLines.body || !updatedCartLines.body.data) {
      throw new Error('No cart lines updated');
    }

    const { cartLinesUpdate } = updatedCartLines.body.data;

    // Support addons
    const result = this.cartAddOns(cartLinesUpdate.cart);

    return result;
  }

  async checkoutCreate(@Body() body): Promise<any> {
    const { checkoutCreateData } = body;

    const client = this.client();

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
                  webUrl
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

  async checkoutCustomerAssociateV2(@Body() body): Promise<any> {
    const { checkoutId, customerAccessToken } = body;

    const client = this.client();

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

  async checkoutCompleteFree(@Body() body): Promise<any> {
    const { checkoutId } = body;

    const client = this.client();

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

  async checkoutShippingAddressUpdateV2(@Body() body): Promise<any> {
    const { checkoutId, shippingAddress } = body;

    const client = this.client();

    const updatedCheckout = await client
      .query<any>({
        data: {
          query: `
            mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
              checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
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
            shippingAddress,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!updatedCheckout || !updatedCheckout.body || !updatedCheckout.body.data) {
      throw new Error('Unable to update checkout');
    }

    const { checkoutShippingAddressUpdateV2 } = updatedCheckout.body.data;

    return checkoutShippingAddressUpdateV2.checkout;
  }
}
