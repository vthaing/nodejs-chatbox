import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { WsAuthStrategy } from 'src/modules/auth/strategies/ws-auth.strategy';
import { UserDocument } from '../user/entities/user.entity';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';
import { MessageFilterService } from '../message/message-filter.service';
import { MediaItem } from '../media-item/entities/media-item.entity';
import { IpFilterGuard } from '../ip-filter/ipfilter.guard';
import { MessageDocument } from '../message/entities/message.entity';
import { extract, parse } from 'query-string';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface SocketWithUserData extends Socket {
  user: Partial<UserDocument>;
}

@Injectable()
@UseGuards(IpFilterGuard)
@WebSocketGateway(3002, { namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly wsAuthStrategy: WsAuthStrategy,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly messageFilterService: MessageFilterService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(socket: SocketWithUserData): Promise<void> {
    const logger = new Logger();
    try {
      // get user from token
      const userFromSocket = await this.wsAuthStrategy.validate(
        this.getUserFromWSToken(socket.handshake),
      );
      // update user online status
      const updatedUser = await this.userService.update(userFromSocket.id, {
        online: true,
      });
      this.userService.addUserIpHistory(updatedUser, socket.handshake.address);
      // set user on socket
      socket.user = updatedUser;
      logger.verbose('Client connected to chat');
      // retrieve connected users
      // const connectedUsers = await this.userService.findAll();
      // const userConversations =
      //   await this.conversationService.findUserConversations(userFromSocket.id);
      // join user to a chat room (private)
      socket.join(updatedUser.id);

      // this.server.emit('online-users', []);
      // this.server.emit('user-conversations', []);
    } catch (e) {
      logger.error(
        'Socket disconnected within handleConnection() in AppGateway:',
        e,
      );
      socket.disconnect();
      return;
    }
  }

  async handleDisconnect(client: SocketWithUserData) {
    const logger = new Logger();
    try {
      // update user online status to false
      const user = client.user;
      await this.userService.update(user.id, {
        online: false,
      });
      // retrieve connected users
      const connectedUsers = await this.userService.findAll();
      this.server.emit('online-users', connectedUsers);

      logger.warn('Client disconnected: chat');
    } catch (error) {
      logger.error('Disconnection with errors');
    }
  }

  @SubscribeMessage('private-message')
  async handleMessage(@MessageBody() message: CreateMessageDto): Promise<void> {
    const createMessage = await this.messageService
      .create(message)
      .then((createdMessage) =>
        createdMessage.populate(
          this.messageService.getRequiredRelationProperties(),
        ),
      )
      .then((createdMessage) =>
        this.messageFilterService.filterAndHandleViolateMessage(createdMessage),
      );

    if (createMessage.conversation) {
      this.server
        .to(createMessage.conversation.toString())
        .emit('private-message', createMessage);
    } else {
      this.server.to(message.to).emit('private-message', createMessage);
      this.server.to(message.from).emit('private-message', createMessage);
    }

    if (createMessage.isViolatedMessage) {
      await createMessage.populate('userBanRequestDocuments');
      this.sendServerAlert(message.from, {
        message: 'Your account has been banned',
        reasons: createMessage.bannedReasons,
        forceLogout: true,
      });
      this.server.in(message.from).disconnectSockets();
    }
  }

  @SubscribeMessage('open-conversation-chat')
  async openConversationChat(@MessageBody() messageBody: any): Promise<void> {
    this.server.socketsJoin(messageBody.conversation);
  }

  sendServerAlert(roomId, data: any) {
    this.server.to(roomId).emit('server-alert', data);
  }

  async emitMediaItemUploaded(mediaItem: MediaItem) {
    const message = await this.messageService.findOne(mediaItem.messageId);
    const roomId = message.to?.toString() ?? message.conversation.toString();
    this.server.to(roomId).emit('attachment-uploaded', mediaItem);
  }

  async emitPinMessageChanged(message: MessageDocument) {
    await message.populate(this.messageService.getRequiredRelationProperties());
    const roomId = message.to?.toString() ?? message.conversation.toString();
    this.server.to(roomId).emit('pin-message-status-changed', message);
    return message.transformToChatBoxData();
  }

  async emitMessageDeleted(message: MessageDocument) {
    await message.populate(this.messageService.getRequiredRelationProperties());
    const roomId = message.to?.toString() ?? message.conversation.toString();
    this.server.to(roomId).emit('message-deleted', message);
    return message.transformToChatBoxData();
  }

  getUserFromWSToken(request) {
    const token = parse(extract(request.url))?.authorization as string;
    const authToken = token.replace('Bearer', '').trim();
    const user: Partial<UserDocument> = jwt.verify(
      authToken,
      this.configService.get('jwtSecret'),
    ) as Partial<UserDocument>;
    return user;
  }
}
