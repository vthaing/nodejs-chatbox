import { Injectable } from '@nestjs/common';
import { BadWordService } from '../bad-word/bad-word.service';
import { Message, MessageDocument } from './entities/message.entity';
import { BadWord, BadWordDocument } from '../bad-word/entities/bad-word.entity';

@Injectable()
export class MessageFilterService {
  constructor(private badWordService: BadWordService) {}

  getProfaneWords(message: MessageDocument): Promise<BadWordDocument[]> {
    return this.badWordService.findProfane(message.text);
  }

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<Message> {
    await this.filterBadWords(message);
    return message;
  }

  filterBadWords(message: MessageDocument): Promise<BadWord[]> {
    return this.getProfaneWords(message).then((badWords) => {
      if (badWords.length === 0) {
        return badWords;
      }

      message.maskedText = this.cleanBadWords(message.text, badWords);
      return message.save().then(() => badWords);
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
