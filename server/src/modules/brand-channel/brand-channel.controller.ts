import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Req,
} from '@nestjs/common';
import { BrandChannelService } from './brand-channel.service';
import { CreateBrandChannelDto } from './dto/create-brand-channel.dto';
import { UpdateBrandChannelDto } from './dto/update-brand-channel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {Request} from "express";

@ApiBearerAuth()
@ApiTags('Brand Channel')
@UseGuards(JwtAuthGuard)
@Controller('brand-channels')
export class BrandChannelController {
  constructor(private readonly brandChannelService: BrandChannelService) {}

  @Post()
  create(@Body() createBrandChannelDto: CreateBrandChannelDto) {
    return this.brandChannelService.create(createBrandChannelDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const params: any = {};
    if (req.query.id) {
      params._id = { $in: req.query.id };
    }
    if (req.query.brandId) {
      params.brandId = { $in: req.query.brandId };
    }
    return this.brandChannelService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandChannelService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBrandChannelDto: UpdateBrandChannelDto,
  ) {
    return this.brandChannelService.update(id, updateBrandChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandChannelService.remove(id);
  }
}
