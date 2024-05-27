import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MusicModule } from './modules/music/music.module';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { ConfigModule } from './modules/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_SCHEMA'),
          entities: [join(__dirname, '/modules/**/entities/*.entity{.ts,.js}')],
          logging: false,
          synchronize: true,
        };
      },
    }),
    AuthModule,
    MusicModule,
    YoutubeModule,
    PlaylistModule,
    ConfigModule,
    EmailModule,
  ],
})
export class AppModule { }
