import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UserBanRequestDocument } from '../user-ban-request/entities/user-ban-request.entity';
import { Brand, BrandDocument } from '../brand/entities/brand.entity';
import { InitChatDto } from '../brand-chat/dto/init-chat.dto';
import { BrandChatUserDto } from './dto/brand-chat-user.dto';

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

  async getOrCreateUser(
    brand: BrandDocument,
    initChatDto: InitChatDto,
  ): Promise<UserDocument> {
    console.log({
      brandId: brand.id,
      externalId: initChatDto.userId,
    }, 'Finding conditionssss');

    let user = await this.userModel.findOne({
      brandId: brand.id,
      externalId: initChatDto.userId,
    });

    console.log(user, 'Finding result');

    if (!user) {
      const userDto = new BrandChatUserDto();
      userDto.brandId = brand.id;
      userDto.displayName = initChatDto.userDisplayName;
      userDto.externalId = initChatDto.userId;

      user = new this.userModel(userDto);
      await user.save();
    }
    return user;
  }
}
