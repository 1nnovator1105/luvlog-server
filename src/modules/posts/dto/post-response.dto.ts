export class PostResponseDto {
  CONTENTS_ID: number;
  CONTENTS_TITLE: string;
  CONTENTS_SUMMARY: string;
  CONTENTS_AUTHOR: string;
  CREATE_DATE: string;
}

export class PostDetailResponseDto {
  TITLE: string;
  AUTHOR: string;
  CONTENTS: string;
  CREATE_DATE: string;
  ACCESS_LEVEL: number;
}

export class PostStatusDto {
  TOTAL_CNT: number;
  TOTAL_PAGE: number;
}
