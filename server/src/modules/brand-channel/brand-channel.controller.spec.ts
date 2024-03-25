import { Test, TestingModule } from '@nestjs/testing';
import { BrandChannelController } from './brand-channel.controller';
import { BrandChannelService } from './brand-channel.service';

describe('BrandChannelController', () => {
  let controller: BrandChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandChannelController],
      providers: [BrandChannelService],
    }).compile();

    controller = module.get<BrandChannelController>(BrandChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
