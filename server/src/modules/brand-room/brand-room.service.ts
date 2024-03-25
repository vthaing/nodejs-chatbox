import { Injectable } from '@nestjs/common';
import { CreateBrandRoomDto } from './dto/create-brand-room.dto';
import { UpdateBrandRoomDto } from './dto/update-brand-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BrandRoom, BrandRoomDocument } from './entities/brand-room.entity';

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
}
