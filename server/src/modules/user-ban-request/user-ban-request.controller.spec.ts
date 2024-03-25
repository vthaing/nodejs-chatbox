import { Test, TestingModule } from '@nestjs/testing';
import { UserBanRequestController } from './user-ban-request.controller';
import { UserBanRequestService } from './user-ban-request.service';

describe('UserBanRequestController', () => {
  let controller: UserBanRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBanRequestController],
      providers: [UserBanRequestService],
    }).compile();

    controller = module.get<UserBanRequestController>(UserBanRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
