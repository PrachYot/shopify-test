import { Injectable } from '@nestjs/common';
import { CartLineInput } from 'src/storefront/inputs/card-line/cartLine.input';
import { CartLineUpdateInput } from 'src/storefront/inputs/card-line/cartLineUpdate.input';
import { Cart } from 'src/storefront/models/cart/cart.model';
import { StorefrontService } from '../storefront/storefront.service';

@Injectable()
export class CartService {
  constructor(private storefrontService: StorefrontService) {}

  async cartCreate(): Promise<Cart> {
    const client = this.storefrontService.client();

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

  async cart(cartId: string): Promise<Cart> {
    const client = this.storefrontService.client();

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

    return cart;
  }

  async cartLinesAdd(cartId: string, cartLineData: CartLineInput[]): Promise<Cart> {
    const client = this.storefrontService.client();

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

  async cartLinesRemove(cartId: string, lineIds: string[]): Promise<Cart> {
    const client = this.storefrontService.client();

    const removedCartLines = await client
      .query<any>({
        data: {
          query: `
          mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
            lineIds,
          },
        },
      })
      .catch((error) => {
        throw new Error(error);
      });

    if (!removedCartLines || !removedCartLines.body || !removedCartLines.body.data) {
      throw new Error('No cart lines removed');
    }

    const { cartLinesRemove } = removedCartLines.body.data;

    return cartLinesRemove.cart;
  }

  async cartLinesUpdate(cartId: string, cartLineUpdateData: CartLineUpdateInput[]): Promise<Cart> {
    const client = this.storefrontService.client();

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

    return cartLinesUpdate.cart;
  }
}
