import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Express } from 'express';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    void this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async processAndSaveImage(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const filepath = path.join(this.uploadDir, filename);

    // Resize image to 800x600 and convert to PNG
    await sharp(file.buffer)
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png()
      .toFile(filepath);

    // In a real application, you would upload to S3 here
    // For now, return a local URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }
}
