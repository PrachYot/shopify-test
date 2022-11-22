import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';
import { IServerConfig } from './interfaces/serverConfig';

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
}
