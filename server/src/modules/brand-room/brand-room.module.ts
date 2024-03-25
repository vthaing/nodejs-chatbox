import { Module } from '@nestjs/common';
import { BrandRoomService } from './brand-room.service';
import { BrandRoomController } from './brand-room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandRoom, BrandRoomSchema } from './entities/brand-room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BrandRoom.name,
        schema: BrandRoomSchema,
      },
    ]),
  ],
  controllers: [BrandRoomController],
  providers: [BrandRoomService],
  exports: [BrandRoomService],
})
export class BrandRoomModule {}
