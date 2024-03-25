import { UserDocument } from './../user/entities/user.entity';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, jwtRefreshConstants } from './constants';

export interface TokenUser {
  access_token: string;
  refresh_token: string;
  user: Partial<UserDocument>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserDocument, 'online' & 'username' & 'email'> | null> {
    const user = await this.userService.findOne({ email });
    if (!user) {
      return;
    }
    // compare the password hash
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (isPasswordCorrect) {
      const { online, username, email, id } = user; // do not select the password
      return { online, username, email, id };
    }
    return null;
  }

  async registerAndLogin(user: CreateUserDto) {
    const createdUser = await this.userService.create(user);
    return this.login(createdUser);
  }

  async validateEmail(email: string): Promise<boolean> {
    const user = await this.userService.findOne({ email });
    return user ? true : false;
  }

  async validateByUsername(
    username: string,
  ): Promise<Pick<UserDocument, 'online' & 'username' & 'email'> | null> {
    const user = await this.userService.findOne({ username });
    if (user) {
      const { online, username, email, id } = user;
      return { online, username, email, id };
    }
    return null;
  }

  async login(user: Omit<UserDocument, 'password'>): Promise<TokenUser> {
    const payload: Partial<UserDocument> = {
      username: user.username,
      id: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret, // unique refresh secret from environment vars
      expiresIn: jwtConstants.expiresIn, // unique refresh expiration from environment vars
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshConstants.secret, // unique refresh secret from environment vars
      expiresIn: jwtRefreshConstants.expiresIn, // unique refresh expiration from environment vars
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
      >(refreshToken, { secret: jwtRefreshConstants.secret });
      const accessToken = this.jwtService.sign(payload, {
        secret: jwtConstants.secret, // unique refresh secret from environment vars
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: payload,
      };
    } catch (e) {
      const logger = new Logger();
      if (e.name === 'TokenExpiredError') {
        logger.error('Token expirado');
        throw new UnauthorizedException();
      }
      logger.error('Error on request');
      throw new BadRequestException();
    }
  }
}
