import { Injectable } from '@nestjs/common';
import { ConfigsService } from 'src/configs/service/configs.service';
import { StorefrontService } from '../storefront/storefront.service';

@Injectable()
export class CartService {
  constructor(
    private configsService: ConfigsService,
    private storefrontService: StorefrontService,
  ) {}

  async cartCreate(): Promise<void> {
    // const client = this.storefrontService.client();

    return;
  }
}
