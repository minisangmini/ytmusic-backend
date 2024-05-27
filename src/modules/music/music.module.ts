import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { YoutubeModule } from 'src/modules/youtube/youtube.module';

@Module({
  imports: [YoutubeModule],
  controllers: [MusicController],
  providers: [MusicService]
})
export class MusicModule {}
