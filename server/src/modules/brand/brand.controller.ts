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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {InitChatDto} from "./dto/init-chat.dto";

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Post('init-chat')
  initChat(@Body() initChatDto: InitChatDto) {
    //return this.brandService.create(initChatDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
