import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { UserBanRequestTypeEnum } from '../enum/user-ban-request-type.enum';
import { UserBanRequestStatusEnum } from '../enum/user-ban-request-status.enum';

export class CreateUserBanRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  reason?: string;
  @ApiProperty({ enum: UserBanRequestTypeEnum })
  @IsNotEmpty()
  @IsEnum(UserBanRequestTypeEnum)
  type: string;
  @ApiProperty({ enum: UserBanRequestStatusEnum })
  @IsEnum(UserBanRequestStatusEnum)
  status?: string;

  @ApiProperty()
  duration: number;
  @ApiProperty()
  @IsArray()
  params?: object;
}
