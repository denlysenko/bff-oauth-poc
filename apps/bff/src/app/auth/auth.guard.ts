import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenSet } from 'openid-client';
import { AuthService } from './auth.service';
import { AUTH_COOKIE, TOKEN_PROPERTY } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authCookie = request.cookies[AUTH_COOKIE];

    if (!authCookie) {
      throw new UnauthorizedException();
    }

    const tokenSet: TokenSet = await this._authService.getTokenSetByCookie(
      authCookie
    );

    if (!tokenSet) {
      throw new UnauthorizedException();
    }

    const isTokensValid = await this._authService.verifyToken(
      tokenSet.access_token
    );

    if (isTokensValid) {
      request[TOKEN_PROPERTY] = tokenSet;

      return true;
    }

    try {
      const refreshedTokenSet = await this._authService.refreshToken(
        authCookie
      );

      if (!refreshedTokenSet) {
        throw new UnauthorizedException();
      }

      request[TOKEN_PROPERTY] = refreshedTokenSet;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
