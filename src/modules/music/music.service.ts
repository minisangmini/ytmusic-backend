import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { YoutubeService } from 'src/modules/youtube/youtube.service';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';


@Injectable()
export class MusicService {
  private outputPath = join(__dirname, '..', '..', 'public');

  constructor(
    @Inject(YoutubeService)
    private readonly youtubeService: YoutubeService,
  ) {}

  async searchMusic(title: string) {
    return await this.youtubeService.seach(title);
  }

  async downloadMusic(id: string): Promise<string> {
    await this.youtubeService.isExistId(id);
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const outputFileName = `${id}.mp3`;
    const outputPath = join(this.outputPath, outputFileName);

    if (!existsSync(this.outputPath)) {
      mkdirSync(this.outputPath);
    }

   try {
    const stream = ytdl(videoUrl, { filter: 'audioonly' });
    
    return new Promise((resolve, reject) => {
      ffmpeg({ source: stream })
      .setFfmpegPath(`${ffmpegStatic}`)
      .audioBitrate(128)
      .toFormat('mp3')
      .saveToFile(outputPath)
      .on('error', (err) => reject(err))
      .on('end', () => resolve(outputPath));
    })
   } catch(err) {
    throw new InternalServerErrorException('노래 반환 중 오류 발생')
   }

    // ffmpeg.setFfmpegPath(`${ffmpegStatic}`);

    // return new Promise((resolve, reject) => {
    //   ytdl(videoUrl, { quality: 'highestaudio' })
    //     .pipe(ffmpeg()
    //       .format('mp3')
    //       .audioBitrate(128)
    //       .on('error', (err) => reject(err))
    //       .on('end', () => resolve(outputFileName))
    //       .pipe(createWriteStream(outputPath), { end: true }));
    // });
  }
}


// const stream = ytdl(url, { filter: 'audioonly' });
// const ffmpegProcess = ffmpeg({ source: stream })
//   .setFfmpegPath(ffmpegStatic)
//   .audioBitrate(128)
//   .toFormat('mp3')
//   .saveToFile(outputPath);

// return new Promise((resolve, reject) => {
//   ffmpegProcess.on('end', () => {
//     console.log('Download and conversion completed.');
//     resolve();
//   });

//   ffmpegProcess.on('error', (error) => {
//     console.error('Error during download and conversion:', error);
//     reject(error);
//   });
// });