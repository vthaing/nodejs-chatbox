import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsEmpty()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
