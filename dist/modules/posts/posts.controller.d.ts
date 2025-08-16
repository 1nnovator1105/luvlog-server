import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto, GetPostsStatusQueryDto } from './dto/get-posts-query.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto): Promise<{
        success: boolean;
    }>;
    findAll(query: GetPostsQueryDto): Promise<import("./dto/post-response.dto").PostResponseDto[]>;
    getStatus(query: GetPostsStatusQueryDto): Promise<import("./dto/post-response.dto").PostStatusDto>;
    findOne(postId: string): Promise<import("./dto/post-response.dto").PostDetailResponseDto | null>;
}
