import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Scope,
  Inject,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable({ scope: Scope.REQUEST })
export class UpdateAdminUserPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly userService: UserService,
  ) {}

  async transform(
    updateUser: UpdateUserDto,
    metadata: ArgumentMetadata,
  ): Promise<UpdateUserDto> {
    const userDto = plainToClass(UpdateUserDto, updateUser);
    const errors = await validate(userDto);
    const hasErrors = errors.length > 0;
    const logicErrors: Partial<UpdateUserDto> = {};
    if (hasErrors)
      throw new BadRequestException({ message: 'Invalid data', errors });

    const updatingUserId = this.request.params.id ?? null;
    const existEmail = await this.userService.findByEmail(userDto.email);
    if (existEmail && existEmail.id.toString() !== updatingUserId) {
      logicErrors.email = 'The email has been taken from another user';
    }
    const hasLogicErrors = Object.keys(logicErrors).length;
    if (hasLogicErrors)
      throw new BadRequestException({
        statusCode: 400,
        error: true,
        errors: logicErrors,
      });
    return userDto;
  }
}
