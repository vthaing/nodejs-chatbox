import { Injectable } from '@nestjs/common';
import { CreateBadWordDto } from './dto/create-bad-word.dto';
import { UpdateBadWordDto } from './dto/update-bad-word.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BadWord, BadWordDocument } from './entities/bad-word.entity';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class BadWordService {
  constructor(
    @InjectModel(BadWord.name)
    private readonly badWordModel: Model<BadWordDocument>,
  ) {}

  create(createBadWordDto: CreateBadWordDto) {
    const createdBadWord = new this.badWordModel(createBadWordDto);
    createdBadWord.term = createdBadWord.term.toLowerCase();
    return createdBadWord.save();
  }

  findAll(
    params: FilterQuery<BadWordDocument> = {},
  ): Promise<BadWordDocument[]> {
    return this.badWordModel
      .find({
        ...params,
      })
      .exec();
  }

  findOne(id: string): Promise<BadWordDocument> {
    return this.badWordModel.findById(id).exec();
  }

  update(
    id: string,
    updateBadWordDto: UpdateBadWordDto,
  ): Promise<BadWordDocument> {
    updateBadWordDto.term = updateBadWordDto.term.toLowerCase();
    return this.badWordModel
      .findByIdAndUpdate(id, updateBadWordDto, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string): Promise<BadWordDocument> {
    return this.badWordModel.findByIdAndDelete(id).exec();
  }

  findProfane(text: string): Promise<BadWordDocument[]> {
    return this.badWordModel
      .find({
        $expr: {
          $ne: [{ $indexOfCP: [text.toLowerCase(), '$term'] }, -1],
        },
      })
      .exec();
  }
}
