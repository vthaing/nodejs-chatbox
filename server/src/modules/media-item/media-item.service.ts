import { Injectable } from '@nestjs/common';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import { MediaItem, MediaItemDocument } from './entities/media-item.entity';
import { MessageDocument } from '../message/entities/message.entity';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '@codebrew/nestjs-storage';

@Injectable()
export class MediaItemService {
  constructor(
    @InjectModel(MediaItem.name)
    private readonly restrictedIpModel: PaginateModel<MediaItemDocument>,
    private readonly config: ConfigService,
    private readonly storageService: StorageService,
  ) {}

  create(createMediaItemDto: CreateMediaItemDto) {
    const createdMediaItem = new this.restrictedIpModel(createMediaItemDto);
    return createdMediaItem.save();
  }

  async createMessageAttachment(
    message: MessageDocument,
    file: Express.Multer.File,
  ) {
    const dto = new CreateMediaItemDto();
    dto.messageId = message.id;
    dto.userId = message.from;
    dto.disk = this.config.get('messageAttachmentDisk');
    dto.name = file.originalname;
    dto.size = file.size;
    dto.mimeType = file.mimetype;

    const mediaItem = await this.create(dto);
    message.mediaItemIds.push(mediaItem.id);
    await message.save();
    mediaItem.path = mediaItem.id;
    await mediaItem.save();
    await this.saveMediaItemFile(mediaItem, file);

    return mediaItem.id;
  }

  async saveMediaItemFile(
    mediaItem: MediaItemDocument,
    file: Express.Multer.File,
  ) {
    return await this.storageService
      .getDisk(mediaItem.disk)
      .put(mediaItem.path, file.buffer);
  }

  async getFileFromMediaItem(mediaItem: MediaItemDocument) {
    return this.storageService
      .getDisk(mediaItem.disk)
      .getStream(mediaItem.path);
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
  async findOne(id: string): Promise<MediaItemDocument> {
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
