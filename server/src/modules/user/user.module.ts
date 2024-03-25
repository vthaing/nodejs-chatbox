import { userSchemaFactory } from './factories/user.factory.schema';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { UserBanRequestModule } from '../user-ban-request/user-ban-request.module';
import { ChatModule } from '../chat/chat.module';
import { CommonModule } from '../common/common.module';
import { AdminUserController } from './admin-user.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: userSchemaFactory,
      },
    ]),
    forwardRef(() => UserBanRequestModule),
    forwardRef(() => ChatModule),
    forwardRef(() => CommonModule),
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
