import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBadWordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  term: string;

  @ApiProperty({ required: false })
  @IsArray()
  categories?: Array<string>;
}
