import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontResolver } from './storefront.resolver';

describe('StorefrontResolver', () => {
  let resolver: StorefrontResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorefrontResolver],
    }).compile();

    resolver = module.get<StorefrontResolver>(StorefrontResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
