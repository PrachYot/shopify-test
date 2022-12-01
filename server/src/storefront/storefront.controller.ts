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
  @Post('customer/login')
  async customerAccessTokenCreate(@Req() req): Promise<any> {
    return this.storefrontService.customerAccessTokenCreate(req.body);
  }

  // Product
  @Get('products')
  async products(): Promise<any> {
    return this.storefrontService.products();
  }

  // Cart
  @Post('cart')
  async cart(@Req() req): Promise<any> {
    return this.storefrontService.cart(req.body);
  }

  @Post('cart/create')
  async cartCreate(): Promise<any> {
    return this.storefrontService.cartCreate();
  }

  @Post('cart/lines/add')
  async cartLinesAdd(@Req() req): Promise<any> {
    return this.storefrontService.cartLinesAdd(req.body);
  }

  @Post('cart/lines/update')
  async cartLinesUpdate(@Req() req): Promise<any> {
    return this.storefrontService.cartLinesUpdate(req.body);
  }

  // Checkout
  @Post('checkout/create')
  async checkoutCreate(@Req() req): Promise<any> {
    return this.storefrontService.checkoutCreate(req.body);
  }

  @Post('checkout/customer/associate')
  async checkoutCustomerAssociateV2(@Req() req): Promise<any> {
    return this.storefrontService.checkoutCustomerAssociateV2(req.body);
  }

  @Post('checkout/complete/free')
  async checkoutCompleteFree(@Req() req): Promise<any> {
    return this.storefrontService.checkoutCompleteFree(req.body);
  }

  @Post('checkout/shipping-address/update')
  async checkoutShippingAddressUpdateV2(@Req() req): Promise<any> {
    return this.storefrontService.checkoutShippingAddressUpdateV2(req.body);
  }
}
