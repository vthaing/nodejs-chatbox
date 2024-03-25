import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedIpService } from './restricted-ip.service';

describe('RestrictedIpService', () => {
  let service: RestrictedIpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestrictedIpService],
    }).compile();

    service = module.get<RestrictedIpService>(RestrictedIpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
