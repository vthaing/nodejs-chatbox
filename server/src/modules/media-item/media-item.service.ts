import { Injectable } from '@nestjs/common';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import { MediaItem, MediaItemDocument } from './entities/media-item.entity';

@Injectable()
export class MediaItemService {
  constructor(
    @InjectModel(MediaItem.name)
    private readonly restrictedIpModel: PaginateModel<MediaItemDocument>,
  ) {}

  create(createMediaItemDto: CreateMediaItemDto) {
    const createdMediaItem = new this.restrictedIpModel(createMediaItemDto);
    return createdMediaItem.save();
  }

  paginate(query: FilterQuery<any>, options: PaginateOptions) {
    return this.restrictedIpModel.paginate(query, options);
  }

  findAll(
    params: FilterQuery<MediaItemDocument> = {},
  ): Promise<MediaItemDocument[]> {
    return this.restrictedIpModel
      .find({
        ...params,
      })
      .exec();
  }
  findOne(id: string): Promise<MediaItemDocument> {
    return this.restrictedIpModel.findById(id).exec();
  }

  findOneBy(params): Promise<MediaItemDocument> {
    return this.restrictedIpModel.findOne(params).exec();
  }

  update(
    id: string,
    updateMediaItemDto: UpdateMediaItemDto,
  ): Promise<MediaItemDocument> {
    return this.restrictedIpModel
      .findByIdAndUpdate(id, updateMediaItemDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<MediaItemDocument> {
    return this.restrictedIpModel.findByIdAndDelete(id).exec();
  }
}
