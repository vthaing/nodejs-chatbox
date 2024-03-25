import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandAuthGuard extends AuthGuard('brand-auth-strategy') {}
