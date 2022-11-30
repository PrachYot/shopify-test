import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  // Customer
  @Get('customer/:customerAccessToken')
  async customer(@Param() params): Promise<any> {
    const { customerAccessToken } = params;

    return this.storefrontService.customer(customerAccessToken);
  }

  @Post('customer/create')
  async customerCreate(@Req() req): Promise<any> {
    return this.storefrontService.customerCreate(req.body);
  }

  // Customer token
  @Post('customer/create/access-token')
  async customerAccessTokenCreate(@Req() req): Promise<any> {
    return this.storefrontService.customerAccessTokenCreate(req.body);
  }

  // Product
  @Get('products')
  async products(): Promise<any> {
    return this.storefrontService.products();
  }

  // Cart
  @Get('cart/:cartId')
  async cart(@Param() params): Promise<any> {
    const { cartId } = params;

    return this.storefrontService.cart(cartId);
  }

  @Post('cart/create')
  async cartCreate(): Promise<any> {
    return this.storefrontService.cartCreate();
  }

  @Post('cart/:cartId/lines/add')
  async cartLinesAdd(@Param() params, @Req() req): Promise<any> {
    const { cartId } = params;

    return this.storefrontService.cartLinesAdd(cartId, req.body);
  }

  // Checkout
  @Post('checkout/create')
  async checkoutCreate(@Req() req): Promise<any> {
    return this.storefrontService.checkoutCreate(req.body);
  }

  @Post('checkout/:checkoutId/customer/associate')
  async checkoutCustomerAssociateV2(@Param() params, @Req() req): Promise<any> {
    const { checkoutId } = params;

    return this.storefrontService.checkoutCustomerAssociateV2(checkoutId, req.body);
  }

  @Get('checkout/:checkoutId/complete/free')
  async checkoutCompleteFree(@Param() params): Promise<any> {
    const { checkoutId } = params;

    return this.storefrontService.checkoutCompleteFree(checkoutId);
  }
}
