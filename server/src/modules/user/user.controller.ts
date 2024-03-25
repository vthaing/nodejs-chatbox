import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { ChatGateway } from '../chat/chat.gateway';
import { Request } from 'express';
import { PagingService } from '../common/service/paging.service';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly chatGateway: ChatGateway,
    private readonly pagingService: PagingService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async index(@Req() req: Request, @Res() res) {
    const pagingOptions = this.pagingService.getPagingOptionsFromRequest(req);
    const pagingQuery = this._getPagingQuery(req);
    const pagingResult = await this.userService.paginate(
      pagingQuery,
      pagingOptions,
    );
    return this.pagingService.createPaginationResponse(res, pagingResult);
  }

  @Get('me')
  getMyInfo(@Req() req: any) {
    return req.user;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: string, @Body() banUserDto: BanUserDto) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userService.banUser(user, banUserDto);
    this.chatGateway.sendServerAlert(id, {
      message: 'Your account has been banned',
      forceLogout: true,
    });
  }

  @Patch(':id/unban')
  async unban(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userService.unbanUser(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  _getPagingQuery(req: Request) {
    const pagingQuery = {};
    if (req.query['displayName']) {
      pagingQuery['displayName'] = {
        $regex: new RegExp(`.*${req.query['displayName']}.*`),
        $options: 'i',
      };
    }

    if (req.query.hasOwnProperty('online')) {
      pagingQuery['online'] = req.query.online;
    }

    if (req.query['brandId']) {
      pagingQuery['brandId'] = req.query['brandId'];
    }

    if (req.query.hasOwnProperty('brandStatus')) {
      pagingQuery['brandStatus'] = req.query.brandStatus;
    }

    if (req.query.hasOwnProperty('isBanned')) {
      if (Boolean(req.query.isBanned == 'true')) {
        pagingQuery['bannedFrom'] = { $ne: null };
        pagingQuery['$or'] = [
          { bannedTo: { $gt: new Date() } },
          { bannedTo: { $eq: null } },
        ];
      } else {
        pagingQuery['bannedFrom'] = { $eq: null };
      }
    }

    return pagingQuery;
  }
}
