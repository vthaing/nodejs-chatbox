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
import { MediaItemService } from './media-item.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PagingService } from '../common/service/paging.service';
import { Request } from 'express';
import { PagingMediaItemDto } from './dto/paging-media-item.dto';

@Controller('media')
@ApiBearerAuth()
@ApiTags('Media Items')
@UseGuards(JwtAuthGuard)
export class MediaItemController {
  constructor(
    private readonly restrictedIpService: MediaItemService,
    private readonly pagingService: PagingService,
  ) {}

  @Post()
  async create(@Body() createMediaItemDto: CreateMediaItemDto) {
    return this.restrictedIpService.create(createMediaItemDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res,
    @Query() query: PagingMediaItemDto,
  ) {
    const pagingResult = await this.restrictedIpService.paginate(
      query.getPagingQuery(),
      query.getPagingOptions(),
    );
    return this.pagingService.createPaginationResponse(res, pagingResult);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restrictedIpService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMediaItemDto: UpdateMediaItemDto,
  ) {
    return this.restrictedIpService.update(id, updateMediaItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restrictedIpService.remove(id);
  }
}
