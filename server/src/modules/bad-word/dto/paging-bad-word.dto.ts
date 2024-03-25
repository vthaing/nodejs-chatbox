import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from '../../common/dto/paging.dto';
import { IsOptional } from 'class-validator';

export class PagingBadWordDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  term: string;

  getPagingQuery(): any {
    const pagingQuery = {};
    if (this.term) {
      pagingQuery['term'] = {
        $regex: new RegExp(`.*${this.term}.*`),
        $options: 'i',
      };
    }

    return pagingQuery;
  }
}
