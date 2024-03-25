import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { MediaItemService } from './media-item.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('media')
@ApiTags('Media Items')
export class MediaController {
  constructor(private readonly mediaItemService: MediaItemService) {}

  @Get(':id/:fileName')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const mediaItem = await this.mediaItemService.findOne(id);
    if (!mediaItem) {
      throw new NotFoundException('The file does not exist');
    }

    try {
      const fileStream = await this.mediaItemService.getFileFromMediaItem(
        mediaItem,
      );

      if (fileStream) {
        response.set({
          'Content-Disposition': `inline; filename="${mediaItem.name}"`,
          'Content-Type': mediaItem.mimeType,
          'Cache-Control': 'max-age=31536000',
        });
        fileStream.pipe(response);
      } else {
        throw new NotFoundException('Media not found');
      }
    } catch (e) {
      throw new NotFoundException('Media not found');
    }
  }
}
