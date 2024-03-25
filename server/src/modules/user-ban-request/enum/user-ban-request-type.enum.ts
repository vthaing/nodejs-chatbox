export enum UserBanRequestTypeEnum {
  MESSAGE_CONTAINS_PHONE_NUMBER = 'message_contains_phone_number',
  MESSAGE_CONTAINS_BAD_WORDS = 'message_contains_bad_words',
  DUPLICATED_WITH_THE_OLD_MESSAGE = 'duplicated_with_the_old_message',
  REACH_MESSAGES_LIMITATION_IN_TIME_RANGE = 'reach_message_limitation_in_time_range',

  MANUAL_BAN = 'manual_ban',
  MANUAL_UNBAN = 'unban',
}

export const userBanRequestTypes = [
  {
    id: UserBanRequestTypeEnum.MESSAGE_CONTAINS_PHONE_NUMBER,
    label: 'Message contains phone number',
  },
  {
    id: UserBanRequestTypeEnum.MESSAGE_CONTAINS_BAD_WORDS,
    label: 'Message contains bad words',
  },
  {
    id: UserBanRequestTypeEnum.MANUAL_BAN,
    label: 'Manual ban',
  },
  {
    id: UserBanRequestTypeEnum.MANUAL_UNBAN,
    label: 'Unban',
  },
  {
    id: UserBanRequestTypeEnum.DUPLICATED_WITH_THE_OLD_MESSAGE,
    label: 'Duplicated message',
  },
  {
    id: UserBanRequestTypeEnum.REACH_MESSAGES_LIMITATION_IN_TIME_RANGE,
    label: '2 messages in 3 seconds',
  },
];

const userBanRequestTypesIndexed: object = {};
userBanRequestTypes.map(
  (type) => (userBanRequestTypesIndexed[type.id] = type.label),
);

const getUserBanRequestLabelById = (id: string): string => {
  return userBanRequestTypesIndexed[id] ?? '';
};

export { userBanRequestTypesIndexed, getUserBanRequestLabelById };
