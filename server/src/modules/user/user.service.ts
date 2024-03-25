import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {FilterQuery, Model, ObjectId} from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UserBanRequestDocument } from '../user-ban-request/entities/user-ban-request.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll(params: FilterQuery<UserDocument> = {}) {
    return this.userModel
      .find({
        ...params,
      })
      .sort('-online')
      .exec();
  }

  async findOne(params: FilterQuery<UserDocument>) {
    // const result = await this.userModel.findOne(params).exec();
    return this.userModel.findOne(params).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { upsert: false, new: true })
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async banUserViaUserBanRequests(
    id: string | User | ObjectId,
    userBanRequests: UserBanRequestDocument[],
  ) {
    return this.userModel.findById(id).then((user) => {
      let duration = 0;
      // Get the greatest duration
      userBanRequests.map((userBanRequest) => {
        if (duration < userBanRequest.duration) {
          duration = userBanRequest.duration;
        }

        if (userBanRequest.isBannedForever) {
          duration = null;
          return;
        }
      });

      let banUtil = null;
      if (duration !== null) {
        banUtil = new Date();
        banUtil.setDate(banUtil.getDate() + duration);
      }


      user.bannedFrom = new Date();
      user.bannedTo = banUtil;
      return user.save();
    });
  }
}
