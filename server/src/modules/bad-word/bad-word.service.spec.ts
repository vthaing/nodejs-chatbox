import { Test, TestingModule } from '@nestjs/testing';
import { BadWordService } from './bad-word.service';

describe('BadWordService', () => {
  let service: BadWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadWordService],
    }).compile();

    service = module.get<BadWordService>(BadWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
