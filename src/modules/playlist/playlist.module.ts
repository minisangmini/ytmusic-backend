import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { UserEntity } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { YoutubeService } from '../youtube/youtube.service';
import { YoutubeModule } from '../youtube/youtube.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaylistEntity, UserEntity]),
    AuthModule,
    YoutubeModule
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, JwtStrategy],
})
export class PlaylistModule {}
