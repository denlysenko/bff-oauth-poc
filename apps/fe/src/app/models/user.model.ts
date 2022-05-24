export interface User {
  readonly sub: string;
  readonly email_verified: boolean;
  readonly name: string;
  readonly preferred_username: string;
  readonly given_name: string;
  readonly family_name: string;
  readonly email: string;
}
