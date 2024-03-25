import { Test, TestingModule } from '@nestjs/testing';
import { BrandChannelService } from './brand-channel.service';

describe('ConversationService', () => {
  let service: BrandChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandChannelService],
    }).compile();

    service = module.get<BrandChannelService>(BrandChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
