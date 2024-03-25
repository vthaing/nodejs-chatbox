import { PartialType } from '@nestjs/swagger';
import { CreateUserBanRequestDto } from './create-user-ban-request.dto';

export class UpdateUserBanRequestDto extends PartialType(CreateUserBanRequestDto) {}
