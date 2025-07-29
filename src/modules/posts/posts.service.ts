import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import {
  PostResponseDto,
  PostDetailResponseDto,
  PostStatusDto,
} from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      title: createPostDto.title,
      author: createPostDto.author,
      contents: createPostDto.contents,
      accessLevel: createPostDto.accessLevel ? '1' : '0',
    });

    return this.postRepository.save(post);
  }

  async findAll(
    query: GetPostsQueryDto,
    userRole: string,
  ): Promise<PostResponseDto[]> {
    const pageNum = parseInt(query.page || '0', 10);

    // Build query based on user role
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    // Apply access level filter based on role
    if (userRole === '관리자') {
      queryBuilder.where('post.accessLevel IN (:...levels)', {
        levels: ['0', '1'],
      });
    } else {
      queryBuilder.where('post.accessLevel = :level', { level: '0' });
    }

    // Get all posts for page group calculation
    const allPosts = await queryBuilder
      .orderBy('post.createDate', 'DESC')
      .getMany();

    // Calculate page groups and filter
    const postsWithPageGroup = allPosts.map((post, index) => ({
      CONTENTS_ID: post.id,
      CONTENTS_TITLE: post.title,
      CONTENTS_AUTHOR: post.author,
      CONTENTS: post.contents,
      CREATE_DATE: this.formatDate(post.createDate),
      PAGE_GROUP: Math.ceil((index + 1) / 5),
    }));

    // Filter by requested page group
    const targetPageGroup = pageNum + 1;
    const filteredPosts = postsWithPageGroup.filter(
      (post) => post.PAGE_GROUP === targetPageGroup,
    );

    // Return with CONTENTS_SUMMARY and CONTENTS_AUTHOR
    return filteredPosts.map((post) => ({
      CONTENTS_ID: post.CONTENTS_ID,
      CONTENTS_TITLE: post.CONTENTS_TITLE,
      CONTENTS_SUMMARY: this.truncateContent(post.CONTENTS),
      CONTENTS_AUTHOR: post.CONTENTS_AUTHOR,
      CREATE_DATE: post.CREATE_DATE,
    }));
  }

  async getStatus(userRole: string, limit: number = 5): Promise<PostStatusDto> {
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    // Apply access level filter based on role
    if (userRole === '관리자') {
      queryBuilder.where('post.accessLevel IN (:...levels)', {
        levels: ['0', '1'],
      });
    } else {
      queryBuilder.where('post.accessLevel = :level', { level: '0' });
    }

    const count = await queryBuilder.getCount();

    return {
      TOTAL_CNT: count,
      TOTAL_PAGE: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<PostDetailResponseDto | null> {
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

  private formatDate(date: Date): string {
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

  private truncateContent(content: string): string {
    // Remove HTML tags and truncate
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 100
      ? textContent.substring(0, 100) + '...'
      : textContent;
  }
}
