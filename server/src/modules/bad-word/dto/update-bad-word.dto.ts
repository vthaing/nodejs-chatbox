import { PartialType } from '@nestjs/swagger';
import { CreateBadWordDto } from './create-bad-word.dto';

export class UpdateBadWordDto extends PartialType(CreateBadWordDto) {}
