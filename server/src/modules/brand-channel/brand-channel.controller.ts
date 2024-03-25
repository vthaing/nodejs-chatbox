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
import { BrandChannelService } from './brand-channel.service';
import { CreateBrandChannelDto } from './dto/create-brand-channel.dto';
import { UpdateBrandChannelDto } from './dto/update-brand-channel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

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
  findAll() {
    return this.brandChannelService.findAll();
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
