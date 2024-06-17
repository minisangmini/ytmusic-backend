import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private youtubeService: YoutubeService,
  ) {}

  async isExistPlaylist(playlistId: number, user: UserEntity) {
    const playlist = await this.playlistRepository.findOneBy({ id: playlistId, user });

    if(!playlist) {
      throw new NotFoundException('존재하지 않는 플레이리스트입니다');
    }

    return playlist;
  } 
  
  async createPlaylist(name: string, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다');
    }

    const playlist = {
      name,
      user,
      musicIds: []
    };

    await this.playlistRepository.save(playlist);
  }

  async deletePlaylist(playlistId: number, userId: string) {
    const user = await this.authService.isExistUser(userId);
    await this.isExistPlaylist(playlistId, user);

    await this.playlistRepository.delete({ id: playlistId });
  }

  async addMusic(playlistId: number, musicId: string, userId: string) {
    const user = await this.authService.isExistUser(userId);
    const playlist = await this.isExistPlaylist(playlistId, user);
    await this.youtubeService.isExistId(musicId);

    if(playlist.musicIds.includes(musicId)) {
      throw new ConflictException('이미 플레이리스트에 음악이 존재합니다')
    }

    playlist.musicIds.push(musicId);

    await this.playlistRepository.save(playlist);
  } 

  async deleteMusic(playlistId: number, musicId: string, userId: string) {
    const user = await this.authService.isExistUser(userId);
    const playlist = await this.isExistPlaylist(playlistId, user);

    const index = playlist.musicIds.indexOf(musicId);
    if (index === -1) {
      throw new NotFoundException('노래를 찾을 수 없습니다');
    }

    playlist.musicIds.splice(index, 1);
    await this.playlistRepository.save(playlist);
  }

  async getPlaylists(userId: string) {
    const user = await this.authService.isExistUser(userId);
    const data = await this.playlistRepository.find({ select: ['id', 'name'], where: { user: user } });

    return data;
  }

  async getSongInfoByPlaylist(playlistId: number, userId: string) {
    const user = await this.authService.isExistUser(userId);
    const playlist = await this.isExistPlaylist(playlistId, user);

    const songs = [];
    for(const id of playlist.musicIds) {
      const info = await this.youtubeService.getInfo(id as string);
      songs.push(info);
    }

    return songs;
  }

  async updatePlaylistName(playlistId: number, userId: string, playlistName: string) {
    const user = await this.authService.isExistUser(userId);
    const playlist = await this.isExistPlaylist(playlistId, user);

    playlist.name = playlistName;

    await this.playlistRepository.save(playlist);
  }
}
