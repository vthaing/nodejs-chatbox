import { Module } from '@nestjs/common';
import { PagingService } from './service/paging.service';

@Module({
  providers: [PagingService],
  exports: [PagingService],
})
export class CommonModule {}
