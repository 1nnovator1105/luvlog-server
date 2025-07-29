import { ConfigService } from '@nestjs/config';

export const getAppConfig = (configService: ConfigService) => ({
  port: configService.get<number>('PORT', 3000),
  nodeEnv: configService.get<string>('NODE_ENV', 'development'),
  jwtSecret: configService.get<string>('JWT_SECRET'),
  jwtExpiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
});
