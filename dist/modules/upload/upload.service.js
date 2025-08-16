"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_config_1 = require("../../config/supabase.config");
let UploadService = class UploadService {
    supabase;
    constructor(configService) {
        this.supabase = (0, supabase_config_1.createSupabaseClient)(configService);
    }
    async processAndSaveImage(file) {
        const fileExtension = file.originalname.split('.').pop() || 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        try {
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
            const { data: publicUrlData } = this.supabase.storage
                .from('luvlog')
                .getPublicUrl(`images/${filename}`);
            return publicUrlData.publicUrl;
        }
        catch (error) {
            console.error('Failed to upload image:', error);
            throw new Error('Failed to upload image');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map