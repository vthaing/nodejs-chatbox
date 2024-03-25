import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';

@ApiBearerAuth()
@ApiTags('Brands')
@UseGuards(RoleGuard(Role.Admin))
@UseGuards(JwtAuthGuard)
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const params: any = {};
    if (req.query.id) {
      params._id = { $in: req.query.id };
    }
    return this.brandService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Get(':id/secret-key')
  getSecretKey(@Param('id') id: string) {
    return this.brandService.findOne(id).then((brand) => ({
      id: brand.id,
      secretKey: brand.secretKey,
    }));
  }

  @Patch(':id/generate-secret-key')
  async generateSecretKey(@Param('id') id: string) {
    const brand = await this.brandService.findOne(id);
    brand.secretKey = this.brandService.generateSecretKey();
    await brand.save();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
