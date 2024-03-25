import { UserBanRequestTypeEnum } from './enum/user-ban-request-type.enum';

export class UserBanRequestConfig {
  static getBanDurations() {
    const config = {};
    config[UserBanRequestTypeEnum.MESSAGE_CONTAINS_PHONE_NUMBER] = 3;
    config[UserBanRequestTypeEnum.MESSAGE_CONTAINS_BAD_WORDS] = 3;
    return config;
  }

  static getBanDurationByType(type: string): number {
    return this.getBanDurations()[type] ?? 0;
  }
}
