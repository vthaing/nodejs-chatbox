import { Module } from '@nestjs/common';
import { BrandChannelService } from './brand-channel.service';
import { BrandChannelController } from './brand-channel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BrandChannel,
  BrandChannelSchema,
} from './entities/brand-channel.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BrandChannel.name,
        schema: BrandChannelSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [BrandChannelController],
  providers: [BrandChannelService],
  exports: [BrandChannelService],
})
export class BrandChannelModule {}
