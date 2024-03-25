import { Module } from '@nestjs/common';
import { UserBanRequestService } from './user-ban-request.service';
import { UserBanRequestController } from './user-ban-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import {
  UserBanRequest,
  UserBanRequestSchema,
} from './entities/user-ban-request.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserBanRequest.name,
        schema: UserBanRequestSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [UserBanRequestController],
  providers: [UserBanRequestService],
  exports: [UserBanRequestService],
})
export class UserBanRequestModule {}
