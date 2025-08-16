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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
let PostsService = class PostsService {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async create(createPostDto) {
        const post = this.postRepository.create({
            title: createPostDto.title,
            author: createPostDto.author,
            contents: createPostDto.contents,
            accessLevel: createPostDto.accessLevel ? '1' : '0',
        });
        return this.postRepository.save(post);
    }
    async findAll(query, userRole) {
        const pageNum = parseInt(query.page || '0', 10);
        const queryBuilder = this.postRepository.createQueryBuilder('post');
        if (userRole === '관리자') {
            queryBuilder.where('post.accessLevel IN (:...levels)', {
                levels: ['0', '1'],
            });
        }
        else {
            queryBuilder.where('post.accessLevel = :level', { level: '0' });
        }
        const allPosts = await queryBuilder
            .orderBy('post.createDate', 'DESC')
            .getMany();
        const postsWithPageGroup = allPosts.map((post, index) => ({
            CONTENTS_ID: post.id,
            CONTENTS_TITLE: post.title,
            CONTENTS_AUTHOR: post.author,
            CONTENTS: post.contents,
            CREATE_DATE: this.formatDate(post.createDate),
            PAGE_GROUP: Math.ceil((index + 1) / 5),
        }));
        const targetPageGroup = pageNum + 1;
        const filteredPosts = postsWithPageGroup.filter((post) => post.PAGE_GROUP === targetPageGroup);
        return filteredPosts.map((post) => ({
            CONTENTS_ID: post.CONTENTS_ID,
            CONTENTS_TITLE: post.CONTENTS_TITLE,
            CONTENTS_SUMMARY: this.truncateContent(post.CONTENTS),
            CONTENTS_AUTHOR: post.CONTENTS_AUTHOR,
            CREATE_DATE: post.CREATE_DATE,
        }));
    }
    async getStatus(userRole, limit = 5) {
        const queryBuilder = this.postRepository.createQueryBuilder('post');
        if (userRole === '관리자') {
            queryBuilder.where('post.accessLevel IN (:...levels)', {
                levels: ['0', '1'],
            });
        }
        else {
            queryBuilder.where('post.accessLevel = :level', { level: '0' });
        }
        const count = await queryBuilder.getCount();
        return {
            TOTAL_CNT: count,
            TOTAL_PAGE: Math.ceil(count / limit),
        };
    }
    async findOne(id) {
        const post = await this.postRepository.findOne({
            where: { id },
        });
        if (!post) {
            return null;
        }
        return {
            TITLE: post.title,
            AUTHOR: post.author,
            CONTENTS: post.contents,
            CREATE_DATE: this.formatDate(post.createDate),
            ACCESS_LEVEL: parseInt(post.accessLevel, 10),
        };
    }
    formatDate(date) {
        if (!date) {
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    truncateContent(content) {
        const textContent = content.replace(/<[^>]*>/g, '');
        return textContent.length > 100
            ? textContent.substring(0, 100) + '...'
            : textContent;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map