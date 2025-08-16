# Luvlog Server

> **SpringBoot로 작성됐던 블로그 서버를 NestJS로 포팅한 프로젝트입니다.**
>
> This is a NestJS port of a blog server originally written in SpringBoot with MyBatis.

## 📋 프로젝트 개요

Luvlog Server는 블로그 포스트 관리 기능을 제공하는 RESTful API 서버입니다. 기존 SpringBoot + MyBatis 기반 구현체를 현대적인 NestJS + TypeORM + PostgreSQL 스택으로 마이그레이션하였습니다.

### 주요 특징

- 🔐 **JWT 기반 인증**: Passport.js를 활용한 안전한 인증 시스템
- 👥 **역할 기반 접근 제어**: 관리자/일반 사용자 권한 관리
- 📝 **블로그 포스트 관리**: CRUD 작업 및 접근 레벨 제어
- 🗄️ **PostgreSQL + TypeORM**: 타입 안전성이 보장되는 데이터베이스 작업
- ✅ **DTO 검증**: class-validator를 통한 입력 데이터 검증
- 🧪 **테스트**: Jest를 활용한 단위 및 E2E 테스트

## 🚀 시작하기

### 필요 환경

- Node.js (v18 이상)
- PostgreSQL (v13 이상)
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/luvlog-server.git
cd luvlog-server

# 의존성 설치
npm install
```

### 환경 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=luvlog_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d

# Server
PORT=3000
```

## 🏃‍♂️ 실행

```bash
# 개발 모드 (hot-reload)
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 📚 API 문서

### 인증 (Authentication)

#### 로그인

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**응답:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "관리자"
  }
}
```

### 포스트 관리 (Posts)

#### 포스트 목록 조회

```http
GET /posts?page=1&limit=10
Authorization: Bearer {jwt_token}
```

#### 포스트 생성

```http
POST /posts
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "새로운 포스트",
  "content": "포스트 내용",
  "accessLevel": 0
}
```

#### 포스트 수정

```http
PUT /posts/:id
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

#### 포스트 삭제

```http
DELETE /posts/:id
Authorization: Bearer {jwt_token}
```

## 🏗️ 프로젝트 구조

```
src/
├── auth/                 # 인증 모듈
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── strategies/       # Passport 전략
│   └── guards/          # 인증 가드
├── posts/               # 포스트 모듈
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── posts.module.ts
│   ├── entities/        # TypeORM 엔티티
│   └── dto/            # 데이터 전송 객체
├── users/              # 사용자 모듈
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── entities/
├── common/             # 공통 유틸리티
│   ├── decorators/
│   ├── filters/
│   └── interceptors/
└── main.ts            # 애플리케이션 진입점
```

## 🔄 마이그레이션 노트

### SpringBoot → NestJS 변경사항

| SpringBoot (기존)  | NestJS (현재)            |
| ------------------ | ------------------------ |
| MyBatis XML Mapper | TypeORM Repository       |
| Spring Security    | Passport.js + Guards     |
| @RestController    | @Controller + Decorators |
| @Service           | @Injectable              |
| application.yml    | .env + config module     |
| Maven/Gradle       | npm/yarn                 |

### 주요 개선사항

- **타입 안전성**: TypeScript를 통한 전체 타입 검증
- **모듈화**: NestJS의 모듈 시스템을 활용한 명확한 관심사 분리
- **성능**: 비동기 처리 및 효율적인 데이터베이스 쿼리
- **보안**: bcrypt를 통한 비밀번호 해싱 (기존 평문 저장 개선)
- **테스트**: 종합적인 테스트 커버리지

## 📝 데이터베이스 스키마

### love_ys_user

- 사용자 정보 및 인증 데이터
- 역할 기반 권한 관리

### love_ys_post

- 블로그 포스트 데이터
- 접근 레벨: 0 (공개), 1 (관리자 전용)

### love_ys_code

- 사용자 역할 참조 코드
- 한국어 역할명 유지 (예: "관리자")

## 👥 개발

- 원본 SpringBoot 버전 개발
- NestJS 포팅 및 현대화
- 일부 코드는 [Claude Code](https://claude.ai/code)의 도움을 받아 작성되었습니다.

## 🙏 Acknowledgments

이 프로젝트의 NestJS 포팅 과정에서 [Claude Code](https://claude.ai/code)의 도움을 받았습니다.
