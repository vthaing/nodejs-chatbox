import { PartialType } from '@nestjs/swagger';
import { CreateBrandChannelDto } from './create-brand-channel.dto';

export class UpdateBrandChannelDto extends PartialType(CreateBrandChannelDto) {}
