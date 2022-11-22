import { Query, Resolver } from '@nestjs/graphql';

@Resolver(() => String)
export class StorefrontResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!';
  }
}
