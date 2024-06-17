import { Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiConflictResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MusicDto } from '../music/dto/response/music.dto';

@Controller('playlist')
@UseGuards(JwtAuthGuard)
@ApiTags('playlist')
@ApiBearerAuth('access-token')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) { }

  @Post('/:name/create')
  @HttpCode(200)
  @ApiOperation({ summary: '플레이리스트 생성', description: '플레이리스트를 생성합니다' })
  @ApiParam({ name: 'name', description: '플레이리스트 이름', type: String })
  @ApiOkResponse({ description: '플레이리스트 생성을 성공한 경우' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않은 경우' })
  async createPlaylist(@Req() req, @Param('name') name: string) {
    await this.playlistService.createPlaylist(name, req.user.userId);
  }

  @Delete('/:id/delete')
  @ApiOperation({ summary: '플레이리스트 삭제', description: '플레이리스트를 삭제합니다' })
  @ApiParam({ name: 'id', description: '플레이리스트 이름', type: String })
  @ApiNoContentResponse({ description: '플레이리스트 삭제를 성공한 경우' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않은 경우' })
  @ApiNotFoundResponse({ description: '플레이리스트가 존재하지 않은 경우' })
  async deletePlaylist(@Req() req, @Param('id') id: string) {
    await this.playlistService.deletePlaylist(parseInt(id), req.user.userId);
  }

  @Get('/')
  @ApiOperation({ summary: '유저의 플레이리스트', description: '유저의 플레이리스트를 반환합니다' })
  @ApiOkResponse({ description: '노래를 성공적으로 반환한 경우', type: MusicDto, isArray: true })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않는 경우' })
  async getPlaylists(@Req() req) {
    return await this.playlistService.getPlaylists(req.user.userId);
  }

  @Post('/:id/add/:musicId')
  @HttpCode(200)
  @ApiOperation({ summary: '노래 추가', description: '플레이리스트에 노래를 추가합니다' })
  @ApiParam({ name: 'id', description: '플레이리스트 id', type: String })
  @ApiParam({ name: 'musicId', description: '노래 id', type: String })
  @ApiOkResponse({ description: '노래를 성공적으로 추가한 경우' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않은 경우' })
  @ApiConflictResponse({ description: '플레이리스트에 음악이 이미 존재하는 경우' })
  @ApiNotFoundResponse({
    content: {
      'application/json': {
        examples: {
          '존재하지 않는 플레이리스트': {
            description: '플레이리스트가 존재하지 않은 경우'
          },
          '존재하지 않는 노래': {
            description: '노래id에 해당하는 노래가 존재하지 않은 경우'
          }
        }
      }
    }
  })
  async addMusic(@Req() req, @Param('id') id: string, @Param('musicId') musicId: string) {
    await this.playlistService.addMusic(parseInt(id), musicId, req.user.userId);
  }

  @Delete('/:id/delete/:musicId')
  @ApiOperation({ summary: '노래 삭제', description: '플레이리스트에 노래를 삭제합니다' })
  @ApiParam({ name: 'id', description: '플레이리스트 id', type: String })
  @ApiParam({ name: 'musicId', description: '노래 id', type: String })
  @ApiNoContentResponse({ description: '노래를 성공적으로 삭제한 경우' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않은 경우' })
  @ApiNotFoundResponse({
    content: {
      'application/json': {
        examples: {
          '플레이리스트 미존재': {
            description: '플레이리스트가 존재하지 않은 경우'
          },
          '노래 미존재': {
            description: '노래가 플레이리스트에 존재하지 않은 경우'
          }
        }
      }
    }
  })
  async deleteMusic(@Req() req, @Param('id') id: string, @Param('musicId') musicId: string) {
    await this.playlistService.deleteMusic(parseInt(id), musicId, req.user.userId);
  }

  @Get('/:id') 
  @ApiOperation({ summary: '노래 리스트 검색', description: '플레이리스트에 있는 노래를 반환합니다' })
  @ApiParam({ name: 'id', description: '플레이리스트 id', type: String })
  @ApiOkResponse({ description: '노래를 성공적으로 반환한 경우', type: MusicDto, isArray: true })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않는 경우' })
  @ApiNotFoundResponse({ description: '플레이리스트가 유효하지 않는 경우' })
  async getSongInfoByPlaylist(@Req() req, @Param('id') id: string) {
    return await this.playlistService.getSongInfoByPlaylist(parseInt(id), req.user.userId);
  }

  @Patch('/:id/:name')
  @ApiOperation({ summary: '플레이리스트 제목 변경', description: '플레이리스의 제목을 변경합니다' })
  @ApiParam({ name: 'id', description: '플레이리스트 id', type: String })
  @ApiParam({ name: 'name', description: '변경될 플레이리스트의 이름', type: String })
  @ApiOkResponse({ description: '이름을 성공적으로 수정한 경우' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않는 경우' })
  @ApiNotFoundResponse({ description: '플레이리스트가 유효하지 않는 경우' })
  async updatePlaylistName(@Req() req, @Param('id') id: string, @Param('name') name: string) {
    await this.playlistService.updatePlaylistName(parseInt(id), req.user.userId, name);
  }
}
