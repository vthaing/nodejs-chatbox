import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserBanRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  user: string;
  @ApiProperty()
  reason?: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  params: [];
}
