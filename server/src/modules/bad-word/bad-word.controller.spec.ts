import { Test, TestingModule } from '@nestjs/testing';
import { BadWordController } from './bad-word.controller';
import { BadWordService } from './bad-word.service';

describe('BadWordController', () => {
  let controller: BadWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BadWordController],
      providers: [BadWordService],
    }).compile();

    controller = module.get<BadWordController>(BadWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
