import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private supabase;
    constructor(configService: ConfigService);
    processAndSaveImage(file: Express.Multer.File): Promise<string>;
}
