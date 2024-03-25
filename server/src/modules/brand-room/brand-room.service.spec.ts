import { Test, TestingModule } from '@nestjs/testing';
import { BrandRoomService } from './brand-room.service';

describe('BrandRoomService', () => {
  let service: BrandRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandRoomService],
    }).compile();

    service = module.get<BrandRoomService>(BrandRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
