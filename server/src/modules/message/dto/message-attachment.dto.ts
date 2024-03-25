import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  uid?: string | null;
}
