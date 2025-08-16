"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppConfig = void 0;
const getAppConfig = (configService) => ({
    port: configService.get('PORT', 3000),
    nodeEnv: configService.get('NODE_ENV', 'development'),
    jwtSecret: configService.get('JWT_SECRET'),
    jwtExpiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
    supabase: {
        url: configService.get('SUPABASE_URL'),
        anonKey: configService.get('SUPABASE_ANON_KEY'),
        serviceRoleKey: configService.get('SUPABASE_SERVICE_ROLE_KEY'),
    },
});
exports.getAppConfig = getAppConfig;
//# sourceMappingURL=app.config.js.map