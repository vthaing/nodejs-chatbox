import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Request } from 'express';
import Role from '../../user/role.enum';
import RequestWithUserInterface from '../request-with-user.interface';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context
        .switchToHttp()
        .getRequest<RequestWithUserInterface>();
      const user = request.user;

      return user?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
