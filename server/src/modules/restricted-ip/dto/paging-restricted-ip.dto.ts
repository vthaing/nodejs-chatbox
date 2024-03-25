import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from '../../common/dto/paging.dto';
import { IsOptional } from 'class-validator';

export class PagingRestrictedIpDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  ip: string;
  @ApiProperty({ required: false })
  ips: string[];

  getPagingQuery(): any {
    const pagingQuery = {};
    if (this.ip) {
      pagingQuery['ip'] = {
        $regex: new RegExp(`.*${this.ip}.*`),
        $options: 'i',
      };
    }

    //@TODO should have a mechanism to let this condition doesn't overwrite the above condition
    if (this.ips) {
      pagingQuery['ips'] = {
        $in: this.ips,
      };
    }

    return pagingQuery;
  }
}
