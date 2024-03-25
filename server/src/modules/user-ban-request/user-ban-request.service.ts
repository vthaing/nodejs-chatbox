import { Injectable } from '@nestjs/common';
import { CreateUserBanRequestDto } from './dto/create-user-ban-request.dto';
import { UpdateUserBanRequestDto } from './dto/update-user-ban-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  UserBanRequest,
  UserBanRequestDocument,
} from './entities/user-ban-request.entity';

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
