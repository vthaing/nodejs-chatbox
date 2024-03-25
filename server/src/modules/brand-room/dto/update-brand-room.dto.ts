import { PartialType } from '@nestjs/swagger';
import { CreateBrandRoomDto } from './create-brand-room.dto';

export class UpdateBrandRoomDto extends PartialType(CreateBrandRoomDto) {}
