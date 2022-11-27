import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTokenResolver } from './customer-token.resolver';

describe('CustomerTokenResolver', () => {
  let resolver: CustomerTokenResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerTokenResolver],
    }).compile();

    resolver = module.get<CustomerTokenResolver>(CustomerTokenResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
