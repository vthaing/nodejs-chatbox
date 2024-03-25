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
  async findAll(@Req() req: Request, @Res() res) {
    const pagingOptions = this.pagingService.getPagingOptionsFromRequest(req);
    pagingOptions['sort'] = { ip: 1 };
    const pagingQuery = this._getPagingQuery(req);
    const pagingResult = await this.restrictedIpService.paginate(
      pagingQuery,
      pagingOptions,
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

  _getPagingQuery(req: Request) {
    const pagingQuery = {};

    if (req.query['ip']) {
      pagingQuery['ip'] = {
        $regex: new RegExp(`.*${req.query['ip']}.*`),
        $options: 'i',
      };
    }

    //@TODO should have a mechanism to let this condition doesn't overwrite the above condition
    if (req.query['ips']) {
      pagingQuery['ips'] = {
        $in: req.query['ips'],
      };
    }
    return pagingQuery;
  }
}
