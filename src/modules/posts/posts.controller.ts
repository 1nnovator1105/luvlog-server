import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto, GetPostsStatusQueryDto } from './dto/get-posts-query.dto';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('write')
  @HttpCode(HttpStatus.OK)
  async create(@Body() createPostDto: CreatePostDto) {
    await this.postsService.create(createPostDto);
    return { success: true };
  }

  @Get('getList')
  async findAll(@Query() query: GetPostsQueryDto) {
    const userRole = query.role || 'guest';
    return this.postsService.findAll(query, userRole);
  }

  @Get('getListStatus')
  async getStatus(@Query() query: GetPostsStatusQueryDto) {
    const userRole = query.role || 'guest';
    const parsedLimit = query.readLimit ? parseInt(query.readLimit, 10) : 5;
    return this.postsService.getStatus(userRole, parsedLimit);
  }

  @Get('post/:postId')
  async findOne(@Param('postId') postId: string) {
    const id = parseInt(postId, 10);
    return this.postsService.findOne(id);
  }
}