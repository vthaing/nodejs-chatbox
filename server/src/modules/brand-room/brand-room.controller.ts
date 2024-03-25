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
import { BrandRoomService } from './brand-room.service';
import { CreateBrandRoomDto } from './dto/create-brand-room.dto';
import { UpdateBrandRoomDto } from './dto/update-brand-room.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {Request} from "express";

@ApiBearerAuth()
@ApiTags('Brand Room')
@UseGuards(JwtAuthGuard)
@Controller('brand-rooms')
export class BrandRoomController {
  constructor(private readonly brandRoomService: BrandRoomService) {}

  @Post()
  create(@Body() createBrandRoomDto: CreateBrandRoomDto) {
    return this.brandRoomService.create(createBrandRoomDto);
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
    return this.brandRoomService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandRoomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBrandRoomDto: UpdateBrandRoomDto,
  ) {
    return this.brandRoomService.update(id, updateBrandRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandRoomService.remove(id);
  }
}
