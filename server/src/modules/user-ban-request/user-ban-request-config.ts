import { UserBanRequestTypeEnum } from './enum/user-ban-request-type.enum';

const DUPLICATED_MESSAGE_TIME_LIMIT_MINUTES = 10;
export class UserBanRequestConfig {
  static getBanDurations() {
    const config = {};
    config[UserBanRequestTypeEnum.MESSAGE_CONTAINS_PHONE_NUMBER] = 3;
    config[UserBanRequestTypeEnum.MESSAGE_CONTAINS_BAD_WORDS] = 3;
    config[UserBanRequestTypeEnum.REACH_MESSAGES_LIMITATION_IN_TIME_RANGE] = 3;
    config[UserBanRequestTypeEnum.DUPLICATED_WITH_THE_OLD_MESSAGE] = 3;
    return config;
  }

  static getBanDurationByType(type: string): number {
    return this.getBanDurations()[type] ?? 0;
  }

  static getDuplicatedMessageTimeLimitMinutes(): number {
    return DUPLICATED_MESSAGE_TIME_LIMIT_MINUTES;
  }
}
