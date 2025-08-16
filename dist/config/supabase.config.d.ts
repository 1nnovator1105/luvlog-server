import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare const createSupabaseClient: (configService: ConfigService) => SupabaseClient;
