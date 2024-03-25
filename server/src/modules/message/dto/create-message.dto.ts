import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsEmpty()
  to: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  conversation: string;
  @ApiProperty()
  isPinnedMessage: boolean;
}
