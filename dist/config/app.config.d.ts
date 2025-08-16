import { ConfigService } from '@nestjs/config';
export declare const getAppConfig: (configService: ConfigService) => {
    port: number;
    nodeEnv: string;
    jwtSecret: string | undefined;
    jwtExpiresIn: string;
    supabase: {
        url: string | undefined;
        anonKey: string | undefined;
        serviceRoleKey: string | undefined;
    };
};
