import { Injectable } from '@nestjs/common';
import { BadWordService } from '../bad-word/bad-word.service';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageFilterService {
  constructor(private badWordService: BadWordService) {}

  async isProfane(message: Message) {
    const badWords = await this.badWordService.findProfane(message.text);
		console.log(badWords);
  }
}
