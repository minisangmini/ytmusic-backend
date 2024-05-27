import { ApiProperty } from '@nestjs/swagger';

export class MusicDto {
  @ApiProperty({ example: '8sDiWUV46FI', description: '노래의 id' })
  id: number;

  @ApiProperty({ example: '발라드 모음집', description: '노래의 제목' })
  title: string;

  @ApiProperty({ example: '채널 이름', description: '영상을 올린 채널 이름' })
  channelName: string;

  @ApiProperty({ example: '461713', description: '조회수' })
  viewCount: string;

  @ApiProperty({ example: '03:56', description: '길이' })
  duration: string;

  @ApiProperty({ example: 'https://i.ytimg.com/vi/952-FzeRa5c/hqdefault.jpg', description: '썸네일 url' })
  thumbnailUrl: string;
}
