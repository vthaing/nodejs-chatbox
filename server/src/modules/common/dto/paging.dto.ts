import { ApiProperty } from '@nestjs/swagger';

const DEFAULT_PAGE_SIZE = 10;
export class PagingDto {
  @ApiProperty({ required: false })
  _start: number;
  @ApiProperty({ required: false })
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
