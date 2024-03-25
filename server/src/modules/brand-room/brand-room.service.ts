import { Injectable } from '@nestjs/common';
import { CreateBrandRoomDto } from './dto/create-brand-room.dto';
import { UpdateBrandRoomDto } from './dto/update-brand-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BrandRoom, BrandRoomDocument } from './entities/brand-room.entity';
import { BrandDocument } from '../brand/entities/brand.entity';
import { InitChatDto } from '../brand-chat/dto/init-chat.dto';
import { BrandChannelDocument } from '../brand-channel/entities/brand-channel.entity';
import { CreateBrandChannelDto } from '../brand-channel/dto/create-brand-channel.dto';

@Injectable()
export class BrandRoomService {
  constructor(
    @InjectModel(BrandRoom.name)
    private readonly brandRoomModel: Model<BrandRoomDocument>,
  ) {}

  create(createBrandRoomDto: CreateBrandRoomDto) {
    const createdBrandRoom = new this.brandRoomModel(createBrandRoomDto);
    return createdBrandRoom.save();
  }

  findAll(
    params: FilterQuery<BrandRoomDocument> = {},
  ): Promise<BrandRoomDocument[]> {
    return this.brandRoomModel
      .find({
        ...params,
      })
      .exec();
  }

  findOne(id: string): Promise<BrandRoomDocument> {
    return this.brandRoomModel.findById(id).exec();
  }

  update(
    id: string,
    updateBrandRoomDto: UpdateBrandRoomDto,
  ): Promise<BrandRoomDocument> {
    return this.brandRoomModel
      .findByIdAndUpdate(id, updateBrandRoomDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<BrandRoomDocument> {
    return this.brandRoomModel.findByIdAndDelete(id).exec();
  }

  async getOrCreateBrandRoom(
    initChatDto: InitChatDto,
    brandChannel?: BrandChannelDocument | null,
  ): Promise<BrandRoomDocument | null> {
    if (!initChatDto.roomId || !brandChannel) {
      return null;
    }
    const brandRoom = await this.brandRoomModel
      .findOne({
        externalId: initChatDto.roomId,
        brandId: initChatDto.brandId,
      })
      .then((found) => found);

    if (brandRoom) {
      return brandRoom;
    }

    const brandRoomDto = new CreateBrandRoomDto();

    brandRoomDto.brandId = brandChannel.brandId;
    brandRoomDto.brandChannelId = brandChannel.id;
    brandRoomDto.externalBrandChannelId = brandChannel.externalId;
    brandRoomDto.externalId = initChatDto.roomId;
    brandRoomDto.name = initChatDto.roomName;

    return this.create(brandRoomDto);
  }
}
