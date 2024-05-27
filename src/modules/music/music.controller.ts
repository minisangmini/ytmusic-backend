import { Controller, Get, InternalServerErrorException, Param, Res } from '@nestjs/common';
import { MusicService } from './music.service';
import { ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MusicDto } from './dto/response/music.dto';
import { Response } from 'express';
import { join } from 'path';

@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('/search/:title')
  @ApiOperation({ summary: '노래 검색' })
  @ApiParam({ name: 'title', description: '검색할 노래 제목', type: String })
  @ApiOkResponse({ description: '성공한 경우', type: MusicDto, isArray: true })
  async searchSong(@Param('title') title: string) {
    return await this.musicService.searchMusic(title);
  }

  @Get('/get/:id')
  @ApiOperation({ summary: '노래 재생' })
  @ApiParam({ name: 'id', description: '재생할 노래 id', type: String })
  @ApiOkResponse({ description: '노래 재생에 성공한 경우' })
  @ApiNotFoundResponse({ description: 'id에 해당하는 노래가 없는 경우' })
  @ApiInternalServerErrorResponse({ description: '노래 재생에 실패한 경우' })
  async getSong(@Param('id') id: string, @Res() res: Response) {
    const musicFilePath = await this.musicService.downloadMusic(id);
    res.sendFile(musicFilePath);
  }
}
