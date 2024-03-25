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
import { RestrictedIpService } from './restricted-ip.service';
import { CreateRestrictedIpDto } from './dto/create-restricted-ip.dto';
import { UpdateRestrictedIpDto } from './dto/update-restricted-ip.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';
import { PagingService } from '../common/service/paging.service';
import { Request } from 'express';
import { PagingRestrictedIpDto } from './dto/paging-restricted-ip.dto';

@Controller('restricted-ips')
@ApiBearerAuth()
@ApiTags('Restricted IP')
@UseGuards(RoleGuard(Role.Admin))
@UseGuards(JwtAuthGuard)
export class RestrictedIpController {
  constructor(
    private readonly restrictedIpService: RestrictedIpService,
    private readonly pagingService: PagingService,
  ) {}

  @Post()
  create(@Body() createRestrictedIpDto: CreateRestrictedIpDto) {
    return this.restrictedIpService.create(createRestrictedIpDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res,
    @Query() query: PagingRestrictedIpDto,
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
  update(
    @Param('id') id: string,
    @Body() updateRestrictedIpDto: UpdateRestrictedIpDto,
  ) {
    return this.restrictedIpService.update(id, updateRestrictedIpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restrictedIpService.remove(id);
  }
}
