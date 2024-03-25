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
import { UserBanRequestService } from './user-ban-request.service';
import { CreateUserBanRequestDto } from './dto/create-user-ban-request.dto';
import { UpdateUserBanRequestDto } from './dto/update-user-ban-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user-ban-requests')
@ApiBearerAuth()
@ApiTags('User Ban Request')
@UseGuards(JwtAuthGuard)
export class UserBanRequestController {
  constructor(private readonly userBanRequestService: UserBanRequestService) {}

  @Post()
  create(@Body() createUserBanRequestDto: CreateUserBanRequestDto) {
    return this.userBanRequestService.create(createUserBanRequestDto);
  }

  @Get()
  findAll() {
    return this.userBanRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBanRequestService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserBanRequestDto: UpdateUserBanRequestDto,
  ) {
    return this.userBanRequestService.update(id, updateUserBanRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBanRequestService.remove(id);
  }
}
