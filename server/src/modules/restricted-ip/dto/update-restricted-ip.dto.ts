import { PartialType } from '@nestjs/swagger';
import { CreateRestrictedIpDto } from './create-restricted-ip.dto';

export class UpdateRestrictedIpDto extends PartialType(CreateRestrictedIpDto) {}
