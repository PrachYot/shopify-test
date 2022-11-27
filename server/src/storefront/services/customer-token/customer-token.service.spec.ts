import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTokenService } from './customer-token.service';

describe('CustomerTokenService', () => {
  let service: CustomerTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerTokenService],
    }).compile();

    service = module.get<CustomerTokenService>(CustomerTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
