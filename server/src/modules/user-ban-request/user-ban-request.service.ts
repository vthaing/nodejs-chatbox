import { Injectable } from '@nestjs/common';
import { CreateUserBanRequestDto } from './dto/create-user-ban-request.dto';
import { UpdateUserBanRequestDto } from './dto/update-user-ban-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  UserBanRequest,
  UserBanRequestDocument,
} from './entities/user-ban-request.entity';
import { MessageDocument } from '../message/entities/message.entity';
import { BadWordDocument } from '../bad-word/entities/bad-word.entity';
import { UserBanRequestTypeEnum } from './enum/user-ban-request-type.enum';
import { UserBanRequestStatusEnum } from './enum/user-ban-request-status.enum';
import { UserBanRequestConfig } from './user-ban-request-config';
import { User, UserDocument } from '../user/entities/user.entity';
import { BanUserDto } from '../user/dto/ban-user.dto';

@Injectable()
export class UserBanRequestService {
  constructor(
    @InjectModel(UserBanRequest.name)
    private readonly userBanRequestModel: Model<UserBanRequestDocument>,
  ) {}

  create(createUserBanRequestDto: CreateUserBanRequestDto) {
    const createdUserBanRequest = new this.userBanRequestModel(
      createUserBanRequestDto,
    );
    return createdUserBanRequest.save();
  }

  createMessageBadWordBanRequest(
    message: MessageDocument,
    badWords: Array<BadWordDocument>,
    status = UserBanRequestStatusEnum.APPROVED,
  ): Promise<UserBanRequestDocument | null> {
    if (badWords.length === 0) {
      return null;
    }
    const dto = new CreateUserBanRequestDto();
    const banRequestParams = {
      badWordIds: [],
      badWords: [],
      message: message._id,
    };
    badWords.map((badword) => {
      banRequestParams.badWordIds.push(badword._id);
      banRequestParams.badWords.push(badword.term);
    });

    dto.userId = message.from.toString();
    dto.reason =
      'Message contains bad words: "' +
      banRequestParams.badWords.join('; ') +
      '"';
    dto.type = UserBanRequestTypeEnum.MESSAGE_CONTAINS_BAD_WORDS;
    dto.status = status;
    dto.duration = UserBanRequestConfig.getBanDurationByType(dto.type);
    dto.params = banRequestParams;

    const createdUserBanRequest = new this.userBanRequestModel(dto);
    return createdUserBanRequest.save();
  }

  createPhoneNumberUserBanRequest(
    message: MessageDocument,
    phoneNumbers: Array<string>,
    status = UserBanRequestStatusEnum.APPROVED,
  ): Promise<UserBanRequestDocument | null> {
    if (phoneNumbers.length === 0) {
      return null;
    }
    const dto = new CreateUserBanRequestDto();
    const banRequestParams = {
      phoneNumbers: phoneNumbers,
      message: message._id,
    };

    dto.userId = message.from.toString();
    dto.reason =
      'Message contains phone numbers: "' +
      banRequestParams.phoneNumbers.join('; ') +
      '"';
    dto.type = UserBanRequestTypeEnum.MESSAGE_CONTAINS_PHONE_NUMBER;
    dto.status = status;
    dto.duration = UserBanRequestConfig.getBanDurationByType(dto.type);
    dto.params = banRequestParams;

    const createdUserBanRequest = new this.userBanRequestModel(dto);
    return createdUserBanRequest.save();
  }

  createDuplicatedMessageUserBanRequest(
    message: MessageDocument,
    duplicatedMessage: MessageDocument,
    status = UserBanRequestStatusEnum.APPROVED,
  ): Promise<UserBanRequestDocument | null> {
    const dto = new CreateUserBanRequestDto();
    const banRequestParams = {
      duplicatedMessage: duplicatedMessage.id,
      message: message.id,
      duplicatedMessageContent: message.text,
    };

    dto.userId = message.from.toString();
    dto.reason = `Message duplicated with the old message  "(${duplicatedMessage.id}) ${duplicatedMessage.text}"`;

    dto.type = UserBanRequestTypeEnum.DUPLICATED_WITH_THE_OLD_MESSAGE;
    dto.status = status;
    dto.duration = UserBanRequestConfig.getBanDurationByType(dto.type);
    dto.params = banRequestParams;

    const createdUserBanRequest = new this.userBanRequestModel(dto);
    return createdUserBanRequest.save();
  }

  createReachLimitMessagesUserBanRequest(
    message: MessageDocument,
    oldMessages: MessageDocument[],
    status = UserBanRequestStatusEnum.APPROVED,
  ): Promise<UserBanRequestDocument | null> {
    const dto = new CreateUserBanRequestDto();
    const banRequestParams = {
      message: message.id,
      oldMessageIds: oldMessages.map((message) => message.id),
      countMessages: oldMessages.length,
    };

    dto.userId = message.from.toString();
    dto.reason = `Reach the limited messages in a time range. Count messages: ${banRequestParams.countMessages}`;

    dto.type = UserBanRequestTypeEnum.REACH_MESSAGES_LIMITATION_IN_TIME_RANGE;
    dto.status = status;
    dto.duration = UserBanRequestConfig.getBanDurationByType(dto.type);
    dto.params = banRequestParams;

    const createdUserBanRequest = new this.userBanRequestModel(dto);
    return createdUserBanRequest.save();
  }

  createManualBanRequest(
    user: UserDocument,
    banUserDto: BanUserDto,
    status = UserBanRequestStatusEnum.APPROVED,
  ): Promise<UserBanRequestDocument | null> {
    const dto = new CreateUserBanRequestDto();
    dto.userId = user.id;
    dto.reason = banUserDto.reason;

    dto.type = UserBanRequestTypeEnum.MANUAL_BAN;
    dto.status = status;
    dto.duration = banUserDto.duration;

    const createdUserBanRequest = new this.userBanRequestModel(dto);
    return createdUserBanRequest.save();
  }

  createManualUnbanRequest(
    user: UserDocument,
    status = UserBanRequestStatusEnum.APPROVED,
  ) {
    const dto = new CreateUserBanRequestDto();
    dto.userId = user.id;

    dto.type = UserBanRequestTypeEnum.MANUAL_UNBAN;
    dto.status = status;

    const createdUserBanRequest = new this.userBanRequestModel(dto);
    return createdUserBanRequest.save();
  }

  findAll(
    params: FilterQuery<UserBanRequestDocument> = {},
  ): Promise<UserBanRequestDocument[]> {
    return this.userBanRequestModel
      .find({
        ...params,
      })
      .exec();
  }

  findUserUserBanRequests(userId: string): Promise<UserBanRequestDocument[]> {
    return this.userBanRequestModel
      .find({ members: { $all: [userId] } })
      .exec();
  }

  findOne(id: string): Promise<UserBanRequestDocument> {
    return this.userBanRequestModel.findById(id).exec();
  }

  update(
    id: string,
    updateUserBanRequestDto: UpdateUserBanRequestDto,
  ): Promise<UserBanRequestDocument> {
    return this.userBanRequestModel
      .findByIdAndUpdate(id, updateUserBanRequestDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<UserBanRequestDocument> {
    return this.userBanRequestModel.findByIdAndDelete(id).exec();
  }
}
