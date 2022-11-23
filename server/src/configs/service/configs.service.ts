import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';
import { IServerConfig } from '../interfaces/serverConfig';
import { IShopifyConfig } from '../interfaces/shopifyConfig';

@Injectable()
export class ConfigsService {
  constructor(private baseConfig: BaseConfigService) {}

  get nodeEnv(): string {
    return this.baseConfig.get<string>('NODE_ENV') || 'development';
  }

  get clientUrl(): string {
    return this.baseConfig.get<string>('CLIENT_URL') || 'http://localhost:3000';
  }

  get server(): IServerConfig {
    return {
      host: this.baseConfig.get<string>('HOST_SERVICE') || 'localhost',
      port: this.baseConfig.get<number>('PORT_SERVICE') || 8000,
    };
  }

  get shopify(): IShopifyConfig {
    return {
      shop: this.baseConfig.get<string>('SHOP') || '',
      apiKey: this.baseConfig.get<string>('API_KEY') || '',
      apiSecretKey: this.baseConfig.get<string>('API_SECRET_KEY') || '',
      scopes: this.baseConfig.get<string>('SCOPES') || '',
      host: this.baseConfig.get<string>('HOST') || '',
      hostSchema: this.baseConfig.get<string>('HOST_SCHEME') || '',
      storefrontAccessToken: this.baseConfig.get<string>('STOREFRONT_ACCESS_TOKEN') || '',
    };
  }
}
