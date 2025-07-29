import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE', 'luvlog'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // 기존 데이터베이스가 있으므로 false로 설정
  logging: configService.get<string>('NODE_ENV') === 'development',
});