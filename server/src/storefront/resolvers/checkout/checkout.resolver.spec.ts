import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutResolver } from './checkout.resolver';

describe('CheckoutResolver', () => {
  let resolver: CheckoutResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckoutResolver],
    }).compile();

    resolver = module.get<CheckoutResolver>(CheckoutResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
