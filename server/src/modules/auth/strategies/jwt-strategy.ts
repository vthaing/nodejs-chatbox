import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserDocument } from './../../user/entities/user.entity';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate({ id }: Omit<UserDocument, 'password'>) {
    const user = await this.authService.validateByUserId(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
