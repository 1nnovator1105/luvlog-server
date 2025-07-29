import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const createSupabaseClient = (
  configService: ConfigService,
): SupabaseClient => {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');
  const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

  // 환경변수 검증
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration missing:');
    console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error(
      'SUPABASE_SERVICE_ROLE_KEY:',
      supabaseKey ? 'Set' : 'Missing',
    );
    throw new Error(
      'Supabase URL and Service Role Key must be provided in environment variables',
    );
  }

  // URL 형식 검증
  if (
    !supabaseUrl.startsWith('https://') ||
    !supabaseUrl.includes('.supabase.co')
  ) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
    console.error('Expected format: https://your-project-id.supabase.co');
    throw new Error(
      'Invalid Supabase URL format. Should be https://your-project-id.supabase.co',
    );
  }

  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw new Error('Failed to initialize Supabase client');
  }
};
