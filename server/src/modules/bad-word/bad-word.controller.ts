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
import { BadWordService } from './bad-word.service';
import { CreateBadWordDto } from './dto/create-bad-word.dto';
import { UpdateBadWordDto } from './dto/update-bad-word.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { badWordCategories } from './bad-word-category.enum';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';

@Controller('bad-words')
@ApiBearerAuth()
@ApiTags('Bad Words')
@UseGuards(RoleGuard(Role.Admin))
@UseGuards(JwtAuthGuard)
export class BadWordController {
  constructor(private readonly badWordService: BadWordService) {}

  @Post()
  create(@Body() createBadWordDto: CreateBadWordDto) {
    return this.badWordService.create(createBadWordDto);
  }

  @Get()
  findAll() {
    return this.badWordService.findAll();
  }

  @Get('categories')
  categories() {
    return badWordCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badWordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBadWordDto: UpdateBadWordDto) {
    return this.badWordService.update(id, updateBadWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badWordService.remove(id);
  }
}
