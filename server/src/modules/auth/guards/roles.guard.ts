import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import Role from '../../user/role.enum';
import RequestWithUserInterface from '../request-with-user.interface';
import RoleEnum from '../../user/role.enum';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context
        .switchToHttp()
        .getRequest<RequestWithUserInterface>();
      const user = request.user;
      // Always allow super admin to access
      if (user && user.roles.includes(RoleEnum.SuperAdmin)) {
        return true;
      }

      return user?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
