import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedIpController } from './restricted-ip.controller';
import { RestrictedIpService } from './restricted-ip.service';

describe('RestrictedIpController', () => {
  let controller: RestrictedIpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestrictedIpController],
      providers: [RestrictedIpService],
    }).compile();

    controller = module.get<RestrictedIpController>(RestrictedIpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
