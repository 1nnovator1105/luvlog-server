# NestJS API Server Design Document

## Overview
Migration of MyBatis-based API to NestJS with PostgreSQL, maintaining existing business logic while adopting modern TypeScript patterns.

## Architecture

### 1. Project Structure
```
luvlog-server/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── config/
│   │   ├── database.config.ts     # Database configuration
│   │   └── app.config.ts          # Application configuration
│   ├── common/
│   │   ├── decorators/            # Custom decorators
│   │   ├── filters/               # Exception filters
│   │   ├── guards/                # Auth guards
│   │   ├── interceptors/          # Response interceptors
│   │   └── pipes/                 # Validation pipes
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/        # JWT/Local strategies
│   │   │   └── dto/
│   │   ├── posts/
│   │   │   ├── posts.module.ts
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   └── users/
│   │       ├── users.module.ts
│   │       ├── users.service.ts
│   │       └── entities/
│   └── database/
│       ├── migrations/            # TypeORM migrations
│       └── seeds/                 # Database seeders
├── test/                         # Test files
├── .env.example                  # Environment variables template
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

### 2. Database Schema

#### Posts Table (love_ys_post)
```typescript
@Entity('love_ys_post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 100 })
  author: string;

  @Column('text')
  contents: string;

  @Column({ 
    type: 'char', 
    length: 1,
    default: '0' 
  })
  access_level: string; // '0': public, '1': admin only

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;
}
```

#### Users Table (love_ys_user)
```typescript
@Entity('love_ys_user')
export class User {
  @Column({ primary: true, length: 50 })
  user_id: string;

  @Column({ length: 100 })
  user_name: string;

  @Column({ length: 20 })
  user_role: string;

  @Column({ length: 255 })
  password: string; // Will be hashed

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;
}
```

#### Code Table (love_ys_code)
```typescript
@Entity('love_ys_code')
export class Code {
  @Column({ primary: true, length: 20 })
  code_unit: string;

  @Column({ primary: true, length: 20 })
  code_id: string;

  @Column({ length: 100 })
  code_name: string;
}
```

### 3. API Endpoints

#### Authentication
- `POST /auth/login` - User login

#### Posts
- `POST /posts` - Create new post
- `GET /posts` - Get paginated posts list
- `GET /posts/status` - Get posts statistics
- `GET /posts/:id` - Get single post

### 4. DTOs and Request/Response Models

#### Auth DTOs
```typescript
// login.dto.ts
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  USER_ID: string;

  @IsNotEmpty()
  @IsString()
  PASSWORD: string;
}

// login-response.dto.ts
export class LoginResponseDto {
  USER_ID: string;
  USER_NAME: string;
  USER_ROLE: string;
  CREATE_DATE: string;
  access_token: string; // JWT token
}
```

#### Post DTOs
```typescript
// create-post.dto.ts
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  TITLE: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  AUTHOR: string;

  @IsNotEmpty()
  @IsString()
  CONTENTS: string;

  @IsIn(['0', '1'])
  ACCESS_LEVEL: string;
}

// get-posts-query.dto.ts
export class GetPostsQueryDto {
  @IsOptional()
  @IsNumberString()
  PAGE_NUM?: string = '0';

  @IsOptional()
  @IsNumberString()
  LIMIT?: string = '5';
}

// post-response.dto.ts
export class PostResponseDto {
  CONTENTS_ID: number;
  CONTENTS_TITLE: string;
  CONTENTS?: string;
  CREATE_DATE: string;
  PAGE_GROUP?: number;
}
```

### 5. Service Layer Design

#### PostsService
```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Implementation matching 'write' mapper
  }

  async findAll(query: GetPostsQueryDto, userRole: string): Promise<PostResponseDto[]> {
    // Implementation matching 'getList' mapper with role-based filtering
  }

  async getStatus(userRole: string, limit: number): Promise<PostStatusDto> {
    // Implementation matching 'getListStatus' mapper
  }

  async findOne(id: number): Promise<Post> {
    // Implementation matching 'getPost' mapper
  }
}
```

### 6. Authentication & Authorization

#### JWT Strategy Implementation
- Use Passport.js with JWT strategy
- Store user role in JWT payload
- Implement role-based guards for access control

#### Role-Based Access Control
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.USER_ROLE === role);
  }
}
```

### 7. Database Query Migration

#### MyBatis to TypeORM Query Builder Examples

1. **getList with pagination and role filtering**:
```typescript
const queryBuilder = this.postRepository
  .createQueryBuilder('post')
  .select([
    'post.id AS CONTENTS_ID',
    'post.title AS CONTENTS_TITLE',
    'post.contents AS CONTENTS',
    `TO_CHAR(post.createDate, 'YYYY-MM-DD HH24:MI:SS') AS CREATE_DATE`,
  ])
  .where(userRole === '관리자' 
    ? 'post.access_level IN (:...levels)' 
    : 'post.access_level = :level',
    userRole === '관리자' 
      ? { levels: ['0', '1'] } 
      : { level: '0' }
  )
  .orderBy('post.createDate', 'DESC')
  .offset(pageNum * 5)
  .limit(5);
```

2. **getListStatus with pagination calculation**:
```typescript
const count = await this.postRepository
  .createQueryBuilder('post')
  .where(userRole === '관리자' 
    ? 'post.access_level IN (:...levels)' 
    : 'post.access_level = :level',
    userRole === '관리자' 
      ? { levels: ['0', '1'] } 
      : { level: '0' }
  )
  .getCount();

return {
  TOTAL_CNT: count,
  TOTAL_PAGE: Math.ceil(count / limit),
};
```

### 8. Configuration

#### Environment Variables (.env)
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=luvlog

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# App
PORT=3000
NODE_ENV=development
```

### 9. Migration Steps

1. **Initialize NestJS Project**
   ```bash
   npm i -g @nestjs/cli
   nest new luvlog-server
   ```

2. **Install Dependencies**
   ```bash
   npm install @nestjs/typeorm typeorm pg
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
   npm install class-validator class-transformer
   npm install bcrypt
   npm install --save-dev @types/passport-jwt @types/passport-local @types/bcrypt
   ```

3. **Database Migration**
   - Create TypeORM migrations for existing schema
   - Ensure column names match existing database
   - Add proper indexes for performance

4. **Security Enhancements**
   - Hash passwords using bcrypt
   - Implement rate limiting
   - Add CORS configuration
   - Use helmet for security headers

### 10. Testing Strategy

- Unit tests for services
- Integration tests for controllers
- E2E tests for complete workflows
- Test database with Docker

### 11. Deployment Considerations

- Use Docker for containerization
- Environment-specific configurations
- Health check endpoints
- Logging with Winston
- PM2 for process management