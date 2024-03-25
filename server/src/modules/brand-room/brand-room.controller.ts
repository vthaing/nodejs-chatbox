import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BrandRoomService } from './brand-room.service';
import { CreateBrandRoomDto } from './dto/create-brand-room.dto';
import { UpdateBrandRoomDto } from './dto/update-brand-room.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

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
  findAll() {
    return this.brandRoomService.findAll();
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
