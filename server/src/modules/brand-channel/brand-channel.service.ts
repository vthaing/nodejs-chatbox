import { Injectable } from '@nestjs/common';
import { CreateBrandChannelDto } from './dto/create-brand-channel.dto';
import { UpdateBrandChannelDto } from './dto/update-brand-channel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  BrandChannel,
  BrandChannelDocument,
} from './entities/brand-channel.entity';

@Injectable()
export class BrandChannelService {
  constructor(
    @InjectModel(BrandChannel.name)
    private readonly brandChannelModel: Model<BrandChannelDocument>,
  ) {}

  create(createBrandChannelDto: CreateBrandChannelDto) {
    const createdBrandChannel = new this.brandChannelModel(
      createBrandChannelDto,
    );
    return createdBrandChannel.save();
  }

  findAll(
    params: FilterQuery<BrandChannelDocument> = {},
  ): Promise<BrandChannelDocument[]> {
    return this.brandChannelModel
      .find({
        ...params,
      })
      .exec();
  }

  findOne(id: string): Promise<BrandChannelDocument> {
    return this.brandChannelModel.findById(id).exec();
  }

  update(
    id: string,
    updateBrandChannelDto: UpdateBrandChannelDto,
  ): Promise<BrandChannelDocument> {
    return this.brandChannelModel
      .findByIdAndUpdate(id, updateBrandChannelDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<BrandChannelDocument> {
    return this.brandChannelModel.findByIdAndDelete(id).exec();
  }
}
