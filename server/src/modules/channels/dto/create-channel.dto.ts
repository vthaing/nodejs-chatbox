import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateChannelDto {
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  owner?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  members: Array<string>;
}
