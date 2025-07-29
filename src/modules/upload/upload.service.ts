import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Express } from 'express';

@Injectable()
export class UploadService {
  private readonly uploadDir = process.env.VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(process.cwd(), 'uploads');

  constructor() {
    void this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      try {
        await fs.mkdir(this.uploadDir, { recursive: true });
      } catch (error) {
        console.warn('Could not create upload directory:', error);
        // In Vercel, we might not have write permissions
        // Continue without failing the entire app
      }
    }
  }

  async processAndSaveImage(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    // In Vercel/serverless environment, we should use external storage
    if (process.env.VERCEL) {
      console.warn(
        'File uploads are not persistent in Vercel. Please use external storage like S3.',
      );
      // For now, just return a data URL
      const resizedBuffer = await sharp(file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png()
        .toBuffer();

      return `data:image/png;base64,${resizedBuffer.toString('base64')}`;
    }

    // Local development
    const filepath = path.join(this.uploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png()
        .toFile(filepath);

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      return `${baseUrl}/uploads/${filename}`;
    } catch (error) {
      console.error('Failed to save image:', error);
      throw new Error('Failed to process image');
    }
  }
}
