import { Test, TestingModule } from '@nestjs/testing';
import { BrandRoomController } from './brand-room.controller';
import { BrandRoomService } from './brand-room.service';

describe('BrandRoomController', () => {
  let controller: BrandRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandRoomController],
      providers: [BrandRoomService],
    }).compile();

    controller = module.get<BrandRoomController>(BrandRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
