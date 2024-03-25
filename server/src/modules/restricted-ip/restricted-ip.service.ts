import { Injectable } from '@nestjs/common';
import { CreateRestrictedIpDto } from './dto/create-restricted-ip.dto';
import { UpdateRestrictedIpDto } from './dto/update-restricted-ip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import {
  RestrictedIp,
  RestrictedIpDocument,
} from './entities/restricted-ip.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RestrictedIpService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(RestrictedIp.name)
    private readonly restrictedIpModel: PaginateModel<RestrictedIpDocument>,
  ) {}

  create(createRestrictedIpDto: CreateRestrictedIpDto) {
    const createdRestrictedIp = new this.restrictedIpModel(
      createRestrictedIpDto,
    );
    return createdRestrictedIp.save().then((restrictedIp) => {
      this.eventEmitter.emit('restricted-ip-changed');
      return restrictedIp;
    });
  }

  paginate(query: FilterQuery<any>, options: PaginateOptions) {
    return this.restrictedIpModel.paginate(query, options);
  }

  findAll(
    params: FilterQuery<RestrictedIpDocument> = {},
  ): Promise<RestrictedIpDocument[]> {
    return this.restrictedIpModel
      .find({
        ...params,
      })
      .exec();
  }

  getAllRestrictedIps(): Promise<string[]> {
    return this.restrictedIpModel
      .find({ enabled: true })
      .then((ips) => ips.map((ip) => ip.ip));
  }

  findOne(id: string): Promise<RestrictedIpDocument> {
    return this.restrictedIpModel.findById(id).exec();
  }

  findOneBy(params): Promise<RestrictedIpDocument> {
    return this.restrictedIpModel.findOne(params).exec();
  }

  update(
    id: string,
    updateRestrictedIpDto: UpdateRestrictedIpDto,
  ): Promise<RestrictedIpDocument> {
    return this.restrictedIpModel
      .findByIdAndUpdate(id, updateRestrictedIpDto, {
        upsert: false,
        new: true,
      })
      .exec()
      .then((restrictedIp) => {
        this.eventEmitter.emit('restricted-ip-changed');
        return restrictedIp;
      });
  }

  remove(id: string): Promise<RestrictedIpDocument> {
    return this.restrictedIpModel
      .findByIdAndDelete(id)
      .exec()
      .then((restrictedIp) => {
        this.eventEmitter.emit('restricted-ip-changed');
        return restrictedIp;
      });
  }
}
