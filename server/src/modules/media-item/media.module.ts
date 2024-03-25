import { forwardRef, Module } from '@nestjs/common';
import { MediaItemService } from './media-item.service';
import { MediaItemController } from './media-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaItem, MediaItemSchema } from './entities/media-item.entity';
import { CommonModule } from '../common/common.module';
import { MediaController } from './media.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MediaItem.name,
        schema: MediaItemSchema,
      },
    ]),
    forwardRef(() => CommonModule),
  ],
  controllers: [MediaItemController, MediaController],
  providers: [MediaItemService],
  exports: [MediaItemService],
})
export class MediaModule {}
