import { Test, TestingModule } from '@nestjs/testing';
import { UserBanRequestService } from './user-ban-request.service';

describe('UserBanRequestService', () => {
  let service: UserBanRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBanRequestService],
    }).compile();

    service = module.get<UserBanRequestService>(UserBanRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
