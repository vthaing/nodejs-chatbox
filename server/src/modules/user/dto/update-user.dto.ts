import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserIpEntity } from '../entities/user-ip.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @ApiProperty({ required: false })
  online: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  ipInfo?: UserIpEntity | null;
}
