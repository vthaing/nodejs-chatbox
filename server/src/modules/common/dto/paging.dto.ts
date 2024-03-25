import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

const DEFAULT_PAGE_SIZE = 10;
export class PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  _start: number;
  @ApiProperty({ required: false })
  @IsOptional()
  _end: number;

  getPagingOptions(additionalParams?: any | null) {
    const start = this._start ?? 0;

    const end = this._end ?? DEFAULT_PAGE_SIZE;
    const pageSize = end - start ?? DEFAULT_PAGE_SIZE;

    return {
      offset: start,
      limit: pageSize,
      ...additionalParams,
    };
  }

  getPagingQuery(): any {
    return {};
  }
}
