import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBadWordDto {
  @ApiProperty({ required: true })
  term: string;

  @ApiProperty({ required: false })
  @IsArray()
  categories?: Array<string>;
}
