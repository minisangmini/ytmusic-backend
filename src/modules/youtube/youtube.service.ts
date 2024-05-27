import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
// import * as cheerio from 'cheerio';
// import * as puppeteer from 'puppeteer';

@Injectable()
export class YoutubeService {
  private readonly API_KEY = 'AIzaSyCR1B42ICK_M3heYG5ejGWnqG3UF55CVQw'
  private readonly YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

  constructor(private readonly httpService: HttpService) { }

  private convertISO8601Duration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours: string | number = parseInt(match?.[1] ?? '0', 10);
    let minutes: string | number = parseInt(match?.[2] ?? '0', 10);
    let seconds: string | number = parseInt(match?.[3] ?? '0', 10);

    hours = hours < 10 ? '0' + hours : hours.toString();
    minutes = minutes < 10 ? '0' + minutes : minutes.toString();
    seconds = seconds < 10 ? '0' + seconds : seconds.toString();

    if (hours === '00') {
      return `${minutes}:${seconds}`;
    } else {
      return `${hours}:${minutes}:${seconds}`;
    }
  }

  async getInfo(id: string) {
    const videoUrl = `${this.YOUTUBE_API_URL}/videos?id=${id}&part=snippet,contentDetails,statistics&key=${this.API_KEY}`;

    const response = await lastValueFrom(this.httpService.get(videoUrl));

    if (response.data.items.length === 0) {
      throw new NotFoundException('id에 해당하는 동영상이 없습니다.');
    }

    const item = response.data.items[0];

    return {
      id: item.id,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      viewCount: item.statistics.viewCount,
      duration: this.convertISO8601Duration(item.contentDetails.duration),
      thumbnailUrl: item.snippet.thumbnails.high.url,
    };
  }


  async isExistId(id: string) {
    const existUrl = `${this.YOUTUBE_API_URL}/videos?id=${id}&part=id&key=${this.API_KEY}`;
    const response = await lastValueFrom(this.httpService.get(existUrl));

    if (response.data.items.length === 0) {
      throw new NotFoundException('id에 해당하는 노래가 없습니다');
    }

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // await page.goto(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, { waitUntil: 'networkidle0' });

    // const element = await page.$('#contents > ytd-background-promo-renderer > div.promo-message.style-scope.ytd-background-promo-renderer > div');

    // if (!element) {
    //   throw new NotFoundException('id에 해당하는 노래가 없습니다');
    // }
  }

  async seach(title: string) {
    const searchUrl = `${this.YOUTUBE_API_URL}/search?part=snippet&maxResults=10&type=video&q=${encodeURIComponent(
      title,
    )}&key=${this.API_KEY}`;

    try {
      const searchResponse = await lastValueFrom(this.httpService.get(searchUrl));
      const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

      const videosUrl = `${this.YOUTUBE_API_URL}/videos?id=${videoIds}&part=snippet,contentDetails,statistics&key=${this.API_KEY}`;
      const videosResponse = await lastValueFrom(this.httpService.get(videosUrl));

      const results = videosResponse.data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        viewCount: item.statistics.viewCount,
        duration: this.convertISO8601Duration(item.contentDetails.duration),
        thumbnailUrl: item.snippet.thumbnails.high.url,
      }));

      return results;
    } catch (error) {
      throw error.response.data;
    }

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`);
    // await page.waitForSelector('#overlays > ytd-thumbnail-overlay-time-status-renderer > #time-status > #text');

    // const content = await page.content();
    // const $ = cheerio.load(content);
    // const $videoList = $('#contents > ytd-video-renderer');

    // const results = [];

    // $videoList.each((idx, element) => {
    //   results.push({
    //     id: $(element).find('#video-title').attr('href').split('/watch?v=')[1].split('&')[0],
    //     title: $(element).find('#video-title > yt-formatted-string').text(),
    //     channelName: $(element).find('#text > a').text(),
    //     viewCount: $(element).find('#metadata-line > span:nth-child(3)').text().replace('조회수 ', ''),
    //     duration: $(element).find('#time-status > #text').attr('aria-label'),
    //     thumbnailurl: $(element).find('#thumbnail > yt-image > img').attr('src')
    //   });
    // })
    // await browser.close();

    // return results;
  }
}
