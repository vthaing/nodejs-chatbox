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
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';
import { PagingService } from '../common/service/paging.service';

@ApiBearerAuth()
@ApiTags('Conversation')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly pagingService: PagingService,
  ) {}

  @UseGuards(RoleGuard(Role.Admin))
  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  async findAll(@Req() req: Request, @Res() res) {
    const pagingOptions = this.pagingService.getPagingOptionsFromRequest(req);
    pagingOptions['populate'] = ['memberObjects'];
    const pagingQuery = this._getPagingQuery(req);
    const pagingResult = await this.conversationService.paginate(
      pagingQuery,
      pagingOptions,
    );
    return this.pagingService.createPaginationResponse(res, pagingResult);
  }

  //@TODO: should move this route to the user module. The URL should be: user/:userId/conversation
  @Get('user-conversation/:userId')
  @UseGuards(RoleGuard(Role.Admin))
  findAllUserConversations(@Param('userId') userId: string) {
    return this.conversationService.findAll({ members: { $all: [userId] } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }

  _getPagingQuery(req: Request) {
    const pagingQuery = {};

    if (req.query['brandId']) {
      pagingQuery['brandId'] = req.query['brandId'];
    }

    if (req.query['brandChannelId']) {
      pagingQuery['brandChannelId'] = req.query['brandChannelId'];
    }

    if (req.query['brandRoomId']) {
      pagingQuery['brandRoomId'] = req.query['brandRoomId'];
    }

    if (req.query['name']) {
      pagingQuery['name'] = {
        $regex: new RegExp(`.*${req.query['name']}.*`),
        $options: 'i',
      };
    }
    return pagingQuery;
  }
}
