import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Req,
} from '@nestjs/common';
import { UserBanRequestService } from './user-ban-request.service';
import { CreateUserBanRequestDto } from './dto/create-user-ban-request.dto';
import { UpdateUserBanRequestDto } from './dto/update-user-ban-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {Request} from "express";

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
  findAll(@Req() req: Request) {
    const params: any = {};
    if (req.query.id) {
      params._id = { $in: req.query.id };
    }
    if (req.query.userId) {
      params.userId = { $in: req.query.userId };
    }
    return this.userBanRequestService.findAll(params);
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
