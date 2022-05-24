export const AUTH_COOKIE = 'sid';
export const TOKEN_PROPERTY = 'tokenSet';
export enum AuthRoutes {
  Login = 'login',
  Logout = 'logout',
  SigninOidc = 'signin-oidc',
  SignoutOidc = 'signout-oidc',
  BackchannelLogout = 'backchannel-logout',
}
