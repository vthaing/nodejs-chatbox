import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Channel, ChannelDocument } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name)
    private readonly channelModel: Model<ChannelDocument>,
  ) {}

  create(createChannelDto: CreateChannelDto) {
    const createdChannel = new this.channelModel(createChannelDto);
    return createdChannel.save();
  }

  findAll(
    params: FilterQuery<ChannelDocument> = {},
  ): Promise<ChannelDocument[]> {
    return this.channelModel
      .find({
        ...params,
      })
      .exec();
  }

  findOne(id: string): Promise<ChannelDocument> {
    return this.channelModel.findById(id).exec();
  }

  update(
    id: string,
    updateChannelDto: UpdateChannelDto,
  ): Promise<ChannelDocument> {
    return this.channelModel
      .findByIdAndUpdate(id, updateChannelDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<ChannelDocument> {
    return this.channelModel.findByIdAndDelete(id).exec();
  }
}
