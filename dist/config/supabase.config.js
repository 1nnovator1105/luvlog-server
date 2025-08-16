"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const createSupabaseClient = (configService) => {
    const supabaseUrl = configService.get('SUPABASE_URL');
    const supabaseKey = configService.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase configuration missing:');
        console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
        console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
        throw new Error('Supabase URL and Service Role Key must be provided in environment variables');
    }
    if (!supabaseUrl.startsWith('https://') ||
        !supabaseUrl.includes('.supabase.co')) {
        console.error('Invalid Supabase URL format:', supabaseUrl);
        console.error('Expected format: https://your-project-id.supabase.co');
        throw new Error('Invalid Supabase URL format. Should be https://your-project-id.supabase.co');
    }
    try {
        return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    catch (error) {
        console.error('Failed to create Supabase client:', error);
        throw new Error('Failed to initialize Supabase client');
    }
};
exports.createSupabaseClient = createSupabaseClient;
//# sourceMappingURL=supabase.config.js.map