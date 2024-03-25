import { Injectable } from '@nestjs/common';
import { CreateUserBanRequestDto } from './dto/create-user-ban-request.dto';
import { UpdateUserBanRequestDto } from './dto/update-user-ban-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  UserBanRequest,
  UserBanRequestDocument,
} from './entities/user-ban-request.entity';
import { UserDocument } from '../user/entities/user.entity';
import { MessageDocument } from '../message/entities/message.entity';
import { BadWord, BadWordDocument } from '../bad-word/entities/bad-word.entity';
import { UserBanRequestTypeEnum } from './enum/user-ban-request-type.enum';
import { UserBanRequestStatusEnum } from './enum/user-ban-request-status.enum';
import { UserBanRequestConfig } from './user-ban-request-config';

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
  ) {
    const dto = new CreateUserBanRequestDto();
    const badWordsToSave = { badWordIds: [], badWords: [] };
    badWords.map((badword) => {
      badWordsToSave.badWordIds.push(badword._id);
      badWordsToSave.badWords.push(badword.term);
    });

    dto.user = message.from.toString();
    dto.reason =
      'Message contains bad words: "' +
      badWordsToSave.badWords.join('; ') +
      '"';
    dto.type = UserBanRequestTypeEnum.MESSAGE_CONTAINS_BAD_WORDS;
    dto.status = status;
    dto.duration = UserBanRequestConfig.getBanDurationByType(dto.type);
    dto.params = badWordsToSave;

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
