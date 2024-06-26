import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './entities/brand.entity';
import { FilterQuery, Model } from 'mongoose';
import { createCipheriv, randomBytes, scrypt } from 'crypto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
  ) {}

  create(createBrandDto: CreateBrandDto) {
    const createdBrand = new this.brandModel(createBrandDto);
    createdBrand.secretKey = this.generateSecretKey();
    return createdBrand.save();
  }

  findAll(params: FilterQuery<BrandDocument> = {}): Promise<BrandDocument[]> {
    return this.brandModel
      .find({
        ...params,
      })
      .exec();
  }

  findUserBrands(userId: string): Promise<BrandDocument[]> {
    return this.brandModel.find({ members: { $all: [userId] } }).exec();
  }

  findOne(id: string): Promise<BrandDocument> {
    return this.brandModel.findById(id).exec();
  }

  update(id: string, updateBrandDto: UpdateBrandDto): Promise<BrandDocument> {
    return this.brandModel
      .findByIdAndUpdate(id, updateBrandDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  generateSecretKey() {
    return randomBytes(256).toString('base64');
  }

  remove(id: string): Promise<BrandDocument> {
    return this.brandModel.findByIdAndDelete(id).exec();
  }
}
