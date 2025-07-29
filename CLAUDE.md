# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

luvlog-server is a NestJS API server that provides blog/post management functionality with role-based access control. This project is being migrated from a MyBatis-based implementation to modern NestJS with TypeORM and PostgreSQL.

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Run tests
npm run test
npm run test:e2e

# Database migrations
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert
```

## Architecture & Structure

### Technology Stack
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator
- **Testing**: Jest

### Key Design Patterns
- **Modular Architecture**: Separate modules for auth, posts, and users
- **Repository Pattern**: TypeORM repositories for data access
- **DTO Pattern**: Separate DTOs for request/response validation
- **Guard Pattern**: Role-based access control using NestJS guards
- **Strategy Pattern**: Passport strategies for authentication

### Database Schema
- `love_ys_post`: Blog posts with access levels (0=public, 1=admin)
- `love_ys_user`: Users with roles
- `love_ys_code`: Reference codes for user roles

### Migration Context
The original MyBatis MAPPER.xml contains:
- User authentication with role lookup
- Post CRUD with role-based filtering
- Pagination with custom PAGE_GROUP calculation
- Korean role names (e.g., "관리자" for admin)

### Important Implementation Notes
1. **Date Formatting**: Use PostgreSQL's TO_CHAR instead of MySQL's DATE_FORMAT
2. **Role Names**: Preserve Korean role names for backward compatibility
3. **Pagination**: Implement PAGE_GROUP logic as `CEIL(ROW_NUMBER/5)`
4. **Access Levels**: '0' = public, '1' = admin only
5. **Password Security**: Original uses plain text - implement bcrypt hashing

## Important Notes

- Refer to DESIGN.md for detailed architecture documentation
- See IMPLEMENTATION_ROADMAP.md for step-by-step migration guide
- The original MAPPER.xml is preserved for reference during migration
- Maintain backward compatibility with response structures