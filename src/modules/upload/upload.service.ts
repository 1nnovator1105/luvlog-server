import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;

  constructor(configService: ConfigService) {
    this.supabase = createSupabaseClient(configService);
  }

  async processAndSaveImage(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    try {
      // Supabase Storage에 업로드
      const { error } = await this.supabase.storage
        .from('luvlog')
        .upload(`images/${filename}`, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error('Failed to upload image to Supabase');
      }

      // 공개 URL 반환
      const { data: publicUrlData } = this.supabase.storage
        .from('luvlog')
        .getPublicUrl(`images/${filename}`);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error('Failed to upload image');
    }
  }
}
