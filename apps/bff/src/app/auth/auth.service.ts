import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { Client, generators, TokenSet } from 'openid-client';
import { AuthRoutes } from './constants';
import { TokenStorage } from './token-storage';

const code_verifier = generators.codeVerifier();

export class AuthService {
  private _jwksClient: JwksClient | null = null;

  constructor(
    private readonly _client: Client,
    private readonly _storage: TokenStorage,
    private readonly _configService: ConfigService
  ) {}

  login(): string {
    const code_challenge = generators.codeChallenge(code_verifier);

    return this._client.authorizationUrl({
      scope: 'openid offline_access',
      code_challenge,
      code_challenge_method: 'S256',
    });
  }

  async callback(req: Request): Promise<string> {
    const params = this._client.callbackParams(req);
    const redirectUri = this._client.redirect_uris[0];
    const tokenSet = await this._client.callback(redirectUri, params, {
      code_verifier,
    });

    const { session_state } = tokenSet;
    await this._storage.set(session_state, tokenSet);

    return session_state;
  }

  async logout(authCookie: string): Promise<string> {
    await this._storage.delete(authCookie);

    const host = this._configService.get('HOST');
    const port = this._configService.get('PORT');

    return this._client.endSessionUrl({
      post_logout_redirect_uri: `${host}:${port}/${AuthRoutes.SignoutOidc}`,
    });
  }

  async backchannelLogout(logoutToken: string): Promise<void> {
    const { sid } = decode(logoutToken, { json: true });
    await this._storage.delete(sid);
  }

  getTokenSetByCookie(authCookie: string): Promise<TokenSet> {
    return this._storage.get(authCookie);
  }

  async refreshToken(authCookie: string): Promise<TokenSet | null> {
    const tokenSet: TokenSet = await this._storage.get(authCookie);

    if (!tokenSet) {
      return null;
    }

    const refreshedTokenSet = await this._client.refresh(
      tokenSet.refresh_token
    );

    await this._storage.set(authCookie, refreshedTokenSet);

    return refreshedTokenSet;
  }

  async verifyToken(token: string): Promise<boolean> {
    if (this._jwksClient === null) {
      this._jwksClient = new JwksClient({
        jwksUri: this._client.issuer.metadata.jwks_uri,
      });
    }

    return new Promise((resolve) => {
      verify(
        token,
        (header, callback) => {
          this._jwksClient.getSigningKey(header.kid, (err, key) => {
            if (err) {
              return callback(err);
            }

            callback(null, key.getPublicKey());
          });
        },
        (err) => {
          if (err) {
            return resolve(false);
          }

          resolve(true);
        }
      );
    });
  }
}
