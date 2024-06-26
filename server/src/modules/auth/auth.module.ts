import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { RegisterUserValidationPipe } from './pipes/register-user.pipe';
import { WsAuthStrategy } from './strategies/ws-auth.strategy';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { UserModule } from './../user/user.module';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {BrandAuthStrategy} from "./strategies/brand-auth.strategy";
import {BrandAuthGuard} from "./guards/brand-auth.guard";
import {BrandAuthService} from "./brand-auth.service";
import {BrandModule} from "../brand/brand.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    JwtRefreshGuard,
    RegisterUserValidationPipe,
    BrandAuthService,
    WsAuthStrategy,
    WsAuthGuard,
    BrandAuthStrategy,
    BrandAuthGuard,
  ],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BrandModule),
    PassportModule.register({
      defaultStrategy: 'local',
      // refresh: 'jwt-refresh',
    }),
    JwtModule.register({}),
  ],
  exports: [
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    WsAuthGuard,
    WsAuthStrategy,
    BrandAuthGuard,
    BrandAuthStrategy,
    AuthService,
  ],
})
export class AuthModule {}
