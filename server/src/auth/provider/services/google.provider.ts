import { BaseOAuthService } from './base-oauth.service';
import { TypeProviderOptions } from './types/provider-options.type';
import { TypeUserInfo } from './types/user-info.type';

interface IGoogleProfile {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name?: string;
  given_name: string;
  hd?: string;
  iat: number;
  iss: string;
  jti?: string;
  locale?: string;
  name: string;
  nbf?: number;
  picture: string;
  sub: string;
  access_token: string;
  refresh_token?: string;
}

export class GoogleProvider extends BaseOAuthService {
  constructor(options: TypeProviderOptions) {
    super({
      name: 'google',
      authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
      access_url: 'https://oauth2.googleapis.com/token',
      profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scopes: options.scopes,
      client_secret: options.client_secret,
      client_id: options.client_id,
    });
  }

  public async extractUserInfo(data: IGoogleProfile): Promise<TypeUserInfo> {
    return super.extractUserInfo({
      name: data.name,
      email: data.email,
      picture: data.picture,
    });
  }
}
