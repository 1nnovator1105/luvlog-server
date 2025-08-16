import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto, PostDetailResponseDto, PostStatusDto } from './dto/post-response.dto';
export declare class PostsService {
    private postRepository;
    constructor(postRepository: Repository<Post>);
    create(createPostDto: CreatePostDto): Promise<Post>;
    findAll(query: GetPostsQueryDto, userRole: string): Promise<PostResponseDto[]>;
    getStatus(userRole: string, limit?: number): Promise<PostStatusDto>;
    findOne(id: number): Promise<PostDetailResponseDto | null>;
    private formatDate;
    private truncateContent;
}
