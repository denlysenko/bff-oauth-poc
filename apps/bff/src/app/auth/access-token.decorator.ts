import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenSet } from 'openid-client';
import { TOKEN_PROPERTY } from './constants';

export const AccessToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenSet: TokenSet = request[TOKEN_PROPERTY];

    if (!tokenSet) {
      throw new UnauthorizedException();
    }

    return tokenSet.access_token;
  }
);
