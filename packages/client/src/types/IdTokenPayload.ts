export class IdTokenPayload {
  at_hash!: string;
  sub!: string;
  'cognito:groups': string[];
  iss!: string;
  'cognito:username': string;
  given_name!: string;
  picture!: string;
  origin_jti!: string;
  aud!: string;
  identities!: Identity[];
  token_use!: string;
  auth_time!: number;
  exp!: number;
  iat!: number;
}

class Identity {
  userId!: string;
  providerName!: string;
  providerType!: string;
  issuer!: null | string;
  primary!: string;
  dateCreated!: string;
}
