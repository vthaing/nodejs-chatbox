import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {FilterQuery, ObjectId, PaginateModel, PaginateOptions} from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UserBanRequestDocument } from '../user-ban-request/entities/user-ban-request.entity';
import { BrandDocument } from '../brand/entities/brand.entity';
import { InitChatDto } from '../brand-chat/dto/init-chat.dto';
import { BrandChatUserDto } from './dto/brand-chat-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UserBanRequestService } from '../user-ban-request/user-ban-request.service';
import { Request } from 'express';
import { PaginationParameters } from 'mongoose-paginate-v2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<any, any, any>,
    private readonly userBanRequestService: UserBanRequestService,
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

  paginate(query: FilterQuery<any>, options: PaginateOptions) {
    return this.userModel.paginate(query, options);
  }

  async findOne(params: FilterQuery<UserDocument>) {
    // const result = await this.userModel.findOne(params).exec();
    return this.userModel.findOne(params).exec();
  }

  async findById(id) {
    return this.userModel.findById(id);
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

      this.setBanUser(user, duration);
      userBanRequests.map((userBanRequest) =>
        user.userBanRequestIds.push(userBanRequest.id),
      );

      return user.save();
    });
  }

  setBanUser(user: UserDocument, duration?: number | null) {
    let banUtil = null;
    if (duration) {
      banUtil = new Date();
      banUtil.setDate(banUtil.getDate() + duration);
    }

    user.bannedFrom = new Date();
    user.bannedTo = banUtil;
  }

  setUnbanUser(user: UserDocument) {
    user.bannedFrom = null;
    user.bannedTo = null;
  }

  async banUser(user: UserDocument, banUserDto: BanUserDto) {
    const userBanRequest =
      await this.userBanRequestService.createManualBanRequest(user, banUserDto);

    user.userBanRequestIds.push(userBanRequest.id);
    this.setBanUser(user, banUserDto.duration);

    return user.save();
  }

  async unbanUser(user: UserDocument) {
    const userBanRequest =
      await this.userBanRequestService.createManualUnbanRequest(user);
    user.userBanRequestIds.push(userBanRequest.id);
    this.setUnbanUser(user);

    return user.save();
  }

  async getOrCreateUser(
    brand: BrandDocument,
    initChatDto: InitChatDto,
  ): Promise<UserDocument> {
    let user = await this.userModel.findOne({
      brandId: brand.id,
      externalId: initChatDto.userId,
    });

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
