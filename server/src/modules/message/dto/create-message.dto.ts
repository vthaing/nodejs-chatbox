import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsEmpty()
  to: string;

  @ApiProperty()
  @IsOptional()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  conversation: string;
  @ApiProperty()
  @IsOptional()
  isPinnedMessage: boolean;
  @ApiProperty()
  @IsOptional()
  attachments: [];
}
