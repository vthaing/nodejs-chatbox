import { Injectable } from '@nestjs/common';
import { BadWordService } from '../bad-word/bad-word.service';
import { Message } from './entities/message.entity';
import { BadWord, BadWordDocument } from '../bad-word/entities/bad-word.entity';

@Injectable()
export class MessageFilterService {
  constructor(private badWordService: BadWordService) {}

  getProfaneWords(message: Message): Promise<BadWordDocument[]> {
    return this.badWordService.findProfane(message.text);
  }

  filterAndHandleViolateMessage(message: Message): Promise<Message> {
    return this.getProfaneWords(message).then((badWords) => {
      if (!badWords) {
        return message;
      }

      message.text = this.clean(message.text, badWords);
      console.log(message.text, 'after cleaning');
      return message;
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
  clean(text: string, badWords: BadWord[]): string {
    let badWord, keyReplacement, lowerText;

    lowerText = text.toLowerCase();
    // loop through each key in the dictionary and search for matches
    // (seems like it'd be faster to indexOf on all keys and run replace on matches, rather than replace all)
    for (badWord in badWords) {
      let index = lowerText.indexOf(badWord.term);
      console.log(index, 'Index found');
      while (index !== -1) {
        keyReplacement = this.stars(badWord.term);

        text =
          text.substring(0, index) +
          keyReplacement +
          text.substring(index + badWord.term.length);
        lowerText = text.toLowerCase();
        index = lowerText.indexOf(badWord.term);
        return text; // break early to avoid external loop to finish, since we have a result
      }
      return text;
    }
  }
}
