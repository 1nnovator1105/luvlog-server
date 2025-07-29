# Implementation Roadmap: MyBatis to NestJS Migration

## Phase 1: Project Setup (Day 1)

### 1. Initialize NestJS Project
```bash
# Remove existing files except MAPPER.xml, DESIGN.md, and this roadmap
rm -rf .git
nest new . --skip-git

# Install core dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install passport passport-jwt passport-local
npm install class-validator class-transformer
npm install bcrypt
npm install --save-dev @types/passport-jwt @types/passport-local @types/bcrypt
```

### 2. Configure TypeORM
Create `src/config/database.config.ts`:
```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'luvlog',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Use migrations in production
  logging: process.env.NODE_ENV === 'development',
});
```

### 3. Create Environment Configuration
Create `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=luvlog

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

PORT=3000
NODE_ENV=development
```

## Phase 2: Database Setup (Day 1-2)

### 1. Create Entities
- `src/modules/posts/entities/post.entity.ts`
- `src/modules/users/entities/user.entity.ts`
- `src/modules/users/entities/code.entity.ts`

### 2. Generate Migrations
```bash
# Generate initial migration
npm run typeorm migration:generate -- -n InitialSchema

# Run migrations
npm run typeorm migration:run
```

### 3. Create Database Seeds
Create seed data for testing:
- Admin user
- Sample posts
- Code table data

## Phase 3: Core Modules Implementation (Day 2-3)

### 1. Users Module
- [ ] Create users.module.ts
- [ ] Implement users.service.ts
- [ ] Add user repository patterns
- [ ] Implement password hashing

### 2. Auth Module
- [ ] Create auth.module.ts
- [ ] Implement auth.service.ts
- [ ] Create JWT strategy
- [ ] Create local strategy
- [ ] Implement auth.controller.ts with login endpoint
- [ ] Add auth guards

### 3. Posts Module
- [ ] Create posts.module.ts
- [ ] Implement posts.service.ts with all CRUD operations
- [ ] Create posts.controller.ts
- [ ] Add role-based access control

## Phase 4: Business Logic Migration (Day 3-4)

### 1. Query Migration Checklist

#### Write Operation
- [ ] Convert INSERT statement to TypeORM save()
- [ ] Add validation
- [ ] Handle SYSDATE() → new Date()

#### GetListStatus Operation
- [ ] Implement count query with role filtering
- [ ] Calculate total pages
- [ ] Return statistics DTO

#### GetList Operation
- [ ] Implement complex pagination query
- [ ] Add role-based WHERE conditions
- [ ] Format dates properly
- [ ] Calculate PAGE_GROUP

#### GetPost Operation
- [ ] Simple findOne with ID
- [ ] Format response dates

#### Login Operation
- [ ] Validate credentials
- [ ] Join with code table for role name
- [ ] Generate JWT token
- [ ] Return user info with token

### 2. Special Considerations

#### Date Formatting
```typescript
// MySQL DATE_FORMAT to PostgreSQL TO_CHAR
// DATE_FORMAT(CREATE_DATE,'%Y-%m-%d %H:%i:%S')
// becomes
// TO_CHAR(create_date, 'YYYY-MM-DD HH24:MI:SS')
```

#### Pagination Logic
```typescript
// Convert MySQL ROW_NUMBER() OVER() to TypeORM
// Use .skip() and .take() for pagination
const pageSize = 5;
const skip = pageNum * pageSize;
```

## Phase 5: Testing (Day 4-5)

### 1. Unit Tests
- [ ] Test services with mocked repositories
- [ ] Test authentication logic
- [ ] Test role-based filtering

### 2. Integration Tests
- [ ] Test controllers with real database
- [ ] Test auth flow
- [ ] Test all endpoints

### 3. E2E Tests
```bash
# Test complete workflows
- User login → Get token
- Create post with token
- Get posts with/without admin role
- Get single post
```

## Phase 6: Security & Performance (Day 5)

### 1. Security Enhancements
- [ ] Add helmet for security headers
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (TypeORM handles this)

### 2. Performance Optimizations
- [ ] Add database indexes
- [ ] Implement query result caching
- [ ] Add compression middleware
- [ ] Configure connection pooling

## Phase 7: Documentation & Deployment (Day 6)

### 1. API Documentation
- [ ] Add Swagger/OpenAPI
- [ ] Document all endpoints
- [ ] Add example requests/responses

### 2. Deployment Preparation
- [ ] Create Dockerfile
- [ ] Add health check endpoint
- [ ] Configure logging
- [ ] Create docker-compose for local development
- [ ] Add PM2 configuration

## Migration Verification Checklist

### Functional Requirements
- [ ] All MyBatis queries successfully migrated
- [ ] Role-based access control working
- [ ] Pagination working correctly
- [ ] Date formatting matches original
- [ ] Login returns same response structure

### Non-Functional Requirements
- [ ] Passwords are hashed (not plain text)
- [ ] JWT authentication implemented
- [ ] Error handling consistent
- [ ] Logging implemented
- [ ] Performance acceptable

## Common Pitfalls to Avoid

1. **Date Handling**: PostgreSQL uses different date functions than MySQL
2. **Case Sensitivity**: PostgreSQL is case-sensitive for string comparisons
3. **Pagination**: Ensure PAGE_GROUP calculation matches original logic
4. **Role Checking**: Maintain exact role names (e.g., "관리자")
5. **Response Format**: Keep same JSON structure for backward compatibility

## Quick Commands Reference

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Run migrations
npm run typeorm migration:run

# Generate new migration
npm run typeorm migration:generate -- -n MigrationName

# Run tests
npm run test
npm run test:e2e
```

## Success Criteria

The migration is complete when:
1. All endpoints return same data structure as MyBatis version
2. Authentication works with JWT tokens
3. Role-based filtering is functional
4. All tests pass
5. Performance is equal or better than MyBatis version