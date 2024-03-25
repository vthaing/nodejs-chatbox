import { Module } from '@nestjs/common';
import { BadWordService } from './bad-word.service';
import { BadWordController } from './bad-word.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BadWord, BadWordSchema } from './entities/bad-word.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BadWord.name,
        schema: BadWordSchema,
      },
    ]),
  ],
  controllers: [BadWordController],
  providers: [BadWordService],
  exports: [BadWordService],
})
export class BadWordModule {}
