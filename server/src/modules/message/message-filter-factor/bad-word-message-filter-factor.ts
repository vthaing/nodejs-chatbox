import { Injectable } from '@nestjs/common';
import { BadWordService } from '../../bad-word/bad-word.service';
import { MessageDocument } from '../entities/message.entity';
import {
  BadWord,
  BadWordDocument,
} from '../../bad-word/entities/bad-word.entity';
import { UserBanRequestService } from '../../user-ban-request/user-ban-request.service';
import { UserBanRequestDocument } from '../../user-ban-request/entities/user-ban-request.entity';
import { MessageFilterFactorInterface } from './message-filter-factor-interface';

@Injectable()
export class BadWordMessageFilterFactor
  implements MessageFilterFactorInterface
{
  constructor(
    private badWordService: BadWordService,
    private userBanRequestService: UserBanRequestService,
  ) {}

  getProfaneWords(message: MessageDocument): Promise<BadWordDocument[]> {
    return this.badWordService.findProfane(message.text);
  }

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<UserBanRequestDocument | null> {
    return this.filterBadWords(message).then((badWords) =>
      this.userBanRequestService.createMessageBadWordBanRequest(
        message,
        badWords,
      ),
    );
  }

  filterBadWords(message: MessageDocument): Promise<BadWordDocument[]> {
    return this.getProfaneWords(message).then((badWords) => {
      if (badWords.length === 0) {
        return badWords;
      }

      message.maskedText = this.cleanBadWords(message.text, badWords);
      return badWords;
    });
  }

  stars(key) {
    let keyReplacement = '';

    for (let i = 0; i < key.length; i++) {
      keyReplacement += '*';
    }

    return keyReplacement;
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   */
  cleanBadWords(text: string, badWords: BadWord[]): string {
    let keyReplacement, lowerText;

    lowerText = text.toLowerCase();
    // loop through each key in the dictionary and search for matches
    // (seems like it'd be faster to indexOf on all keys and run replace on matches, rather than replace all)
    for (const badWordIndex in badWords) {
      let index = lowerText.indexOf(badWords[badWordIndex].term);

      while (index !== -1) {
        keyReplacement = this.stars(badWords[badWordIndex].term);

        text =
          text.substring(0, index) +
          keyReplacement +
          text.substring(index + badWords[badWordIndex].term.length);
        lowerText = text.toLowerCase();
        index = lowerText.indexOf(badWords[badWordIndex].term);
      }
      return text;
    }

    return text;
  }
}
