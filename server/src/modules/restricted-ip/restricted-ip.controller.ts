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
import { RestrictedIpService } from './restricted-ip.service';
import { CreateRestrictedIpDto } from './dto/create-restricted-ip.dto';
import { UpdateRestrictedIpDto } from './dto/update-restricted-ip.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';

@Controller('restricted-ips')
@ApiBearerAuth()
@ApiTags('Restricted IP')
@UseGuards(RoleGuard(Role.Admin))
@UseGuards(JwtAuthGuard)
export class RestrictedIpController {
  constructor(private readonly restrictedIpService: RestrictedIpService) {}

  @Post()
  create(@Body() createRestrictedIpDto: CreateRestrictedIpDto) {
    return this.restrictedIpService.create(createRestrictedIpDto);
  }

  @Get()
  findAll() {
    return this.restrictedIpService.findAll();
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
