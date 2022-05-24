import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AUTH_COOKIE } from './constants';

export const AuthCookie = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().cookies[AUTH_COOKIE];
  }
);
