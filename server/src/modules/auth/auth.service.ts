import { UserDocument } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserAuthInterface } from './UserAuthInterface';
import { ConfigService } from '@nestjs/config';

export interface TokenUser {
  access_token: string;
  refresh_token: string;
  user: Partial<UserDocument>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserAuthInterface | null> {
    const user = await this.userService.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user || user.isBanned || !user.brandStatus) {
      return;
    }
    // compare the password hash
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (isPasswordCorrect) {
      return {
        online: user.online,
        id: user.id,
        displayName: user.displayName ?? user.username,
        roles: user.roles,
      } as UserAuthInterface;
    }
    return null;
  }

  async registerAndLogin(user: CreateUserDto) {
    const createdUser = await this.userService.create(user);
    return this.login(createdUser);
  }

  async validateEmail(email: string): Promise<boolean> {
    const user = await this.userService.findOne({ email });
    return user && !user.isBanned && user.brandStatus;
  }

  async validateByUsername(
    username: string,
  ): Promise<UserAuthInterface | null> {
    const user = await this.userService.findOne({ username });
    if (user && !user.isBanned && user.brandStatus) {
      const { online, displayName, username, id, roles } = user;
      return { online, displayName: displayName ?? username, id, roles };
    }
    return null;
  }

  async validateByUserId(id: string): Promise<UserAuthInterface | null> {
    const user = await this.userService.findById(id);
    if (user && !user.isBanned && user.brandStatus) {
      const { online, displayName, username, id, roles } = user;
      return { online, displayName: displayName ?? username, id, roles };
    }
    return null;
  }

  async login(user: Omit<UserDocument, 'password'>): Promise<TokenUser> {
    const payload: Partial<UserDocument> = {
      id: user.id,
      displayName: user.displayName ?? user.username,
      roles: user.roles,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: this.configService.get('jwtExpiresIn'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwtRefreshSecret'),
      expiresIn: this.configService.get('jwtRefreshExpiresIn'),
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: payload,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenUser> {
    try {
      // if (!refreshTokens.includes(refreshToken)) {
      //     throw new UnauthorizedException();
      // }
      const payload = await this.jwtService.verifyAsync<
        Omit<UserDocument, 'password'>
      >(refreshToken, { secret: this.configService.get('jwtRefreshSecret') });
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('jwtSecret'),
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: payload,
      };
    } catch (e) {
      const logger = new Logger();
      if (e.name === 'TokenExpiredError') {
        logger.error('Token expiration');
        throw new UnauthorizedException();
      }
      logger.error('Error on request');
      throw new BadRequestException();
    }
  }
}
