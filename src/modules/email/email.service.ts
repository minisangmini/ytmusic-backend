import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { EmailEntity } from './entities/email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entities/user.entity';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      }
    });
  }

  async sendVerifyEmail(email: string, userId: string) {
    const id = Date.now();
    const user = await this.authService.isExistUser(userId);

    await this.emailRepository.save({ id: `${id}`, email, user });

    const mailOptions: EmailOptions = {
      to: email,
      subject: '[ytmusic] 메일을 인증해주세요!',
      html: `<a href="https://ytmusic.minisang.xyz/api/email/${email}/verification?id=${id}">버튼을 눌려 인증해주세요</a>`,
    };
    return await this.transporter.sendMail(mailOptions);
  }

  async emailVerify(email: string, id: string) {
    const emailData = await this.emailRepository.findOne({
      where: { id, email },
      relations: ['user'],
    });
    
    if(!emailData) {
      throw new NotFoundException('페이지를 찾을 수 없습니다');
    }
    
    await this.userRepository.update({ id: emailData.user.id }, {
      isEmailVerified: true
    });
    await this.emailRepository.delete({ user: emailData.user });
  }
}
