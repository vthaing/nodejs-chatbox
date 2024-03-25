import { Module } from '@nestjs/common';
import { BrandRoomService } from './brand-room.service';
import { BrandRoomController } from './brand-room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandRoom, BrandRoomSchema } from './entities/brand-room.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BrandRoom.name,
        schema: BrandRoomSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [BrandRoomController],
  providers: [BrandRoomService],
  exports: [BrandRoomService],
})
export class BrandRoomModule {}
