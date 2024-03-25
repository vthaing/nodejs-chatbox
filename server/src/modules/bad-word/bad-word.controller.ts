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
  Res,
  Query,
} from '@nestjs/common';
import { BadWordService } from './bad-word.service';
import { CreateBadWordDto } from './dto/create-bad-word.dto';
import { UpdateBadWordDto } from './dto/update-bad-word.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { badWordCategories } from './bad-word-category.enum';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';
import { PagingService } from '../common/service/paging.service';
import { Request } from 'express';
import { PagingBadWordDto } from './dto/paging-bad-word.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Controller('bad-words')
@ApiBearerAuth()
@ApiTags('Bad Words')
@UseGuards(RoleGuard(Role.Admin))
@UseGuards(JwtAuthGuard)
export class BadWordController {
  constructor(
    private readonly badWordService: BadWordService,
    private readonly pagingService: PagingService,
  ) {}

  @Post()
  async create(@Body() createBadWordDto: CreateBadWordDto) {
    if (!(await this.validateUniqueBadWord(createBadWordDto.term))) {
      throw new BadRequestException('The Bad word is already existed');
    }
    return this.badWordService.create(createBadWordDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res,
    @Query() query: PagingBadWordDto,
  ) {
    const pagingResult = await this.badWordService.paginate(
      query.getPagingQuery(),
      query.getPagingOptions({ sort: { term: 'asc' } }),
    );
    return this.pagingService.createPaginationResponse(res, pagingResult);
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
  async update(
    @Param('id') id: string,
    @Body() updateBadWordDto: UpdateBadWordDto,
  ) {
    if (!(await this.validateUniqueBadWord(updateBadWordDto.term, id))) {
      throw new BadRequestException('The Bad word is already existed');
    }
    return this.badWordService.update(id, updateBadWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badWordService.remove(id);
  }

  async validateUniqueBadWord(badWord: string, recordId?: string | null) {
    const existedBadWord = await this.badWordService.findOneBy({
      term: { $regex: new RegExp(`^${badWord}$`), $options: 'i' },
    });

    if (existedBadWord) {
      if (!recordId) {
        return false;
      } else {
        return existedBadWord.id.toString() === recordId;
      }
    }
    return true;
  }
}
