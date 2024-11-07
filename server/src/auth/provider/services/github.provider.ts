import { BaseOAuthService } from './base-oauth.service';
import { TypeProviderOptions } from './types/provider-options.type';
import { TypeUserInfo } from './types/user-info.type';

interface IGitHubProfile {
  email: string;
  name: string;
  avatar_url: string;
}

export class GithubProvider extends BaseOAuthService {
  constructor(options: TypeProviderOptions) {
    super({
      name: 'github',
      authorize_url: 'https://github.com/login/oauth/authorize',
      access_url: 'https://github.com/login/oauth/access_token',
      profile_url: 'https://api.github.com/user',
      scopes: options.scopes,
      client_secret: options.client_secret,
      client_id: options.client_id,
    });
  }

  public async extractUserInfo(data: IGitHubProfile): Promise<TypeUserInfo> {
    return super.extractUserInfo({
      name: data.name,
      email: data.email,
      picture: data.avatar_url,
    });
  }
}
