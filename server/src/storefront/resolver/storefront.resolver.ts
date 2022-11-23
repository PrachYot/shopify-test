import { Query, Resolver } from '@nestjs/graphql';
import { StorefrontService } from '../service/storefront.service';

@Resolver(() => String)
export class StorefrontResolver {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Query(() => String)
  async hello(): Promise<string> {
    return this.storefrontService.hello();
  }
}
