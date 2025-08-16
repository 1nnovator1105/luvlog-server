"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostStatusDto = exports.PostDetailResponseDto = exports.PostResponseDto = void 0;
class PostResponseDto {
    CONTENTS_ID;
    CONTENTS_TITLE;
    CONTENTS_SUMMARY;
    CONTENTS_AUTHOR;
    CREATE_DATE;
}
exports.PostResponseDto = PostResponseDto;
class PostDetailResponseDto {
    TITLE;
    AUTHOR;
    CONTENTS;
    CREATE_DATE;
    ACCESS_LEVEL;
}
exports.PostDetailResponseDto = PostDetailResponseDto;
class PostStatusDto {
    TOTAL_CNT;
    TOTAL_PAGE;
}
exports.PostStatusDto = PostStatusDto;
//# sourceMappingURL=post-response.dto.js.map