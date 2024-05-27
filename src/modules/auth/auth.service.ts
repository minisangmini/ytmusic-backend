import { ConflictException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import LoginDto from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  async isExistId(id: string): Promise<void> {
    const isExist = await this.userRepository.existsBy({ id });

    if(isExist) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }
  }

  async isExistEmail(email: string): Promise<void> {
    const isExist = await this.userRepository.existsBy({ email });

    if(isExist) {
      throw new ConflictException('이미 존재하는 메일입니다.');
    }
  }
  
  async isExistUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다');
    }

    return user;
  }

  async register(registerDto: RegisterDto) {
    await this.isExistId(registerDto.id);
    await this.isExistEmail(registerDto.email);
    
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = {
      ...registerDto,
      password: hashedPassword
    };
    
    const userData = await this.userRepository.save(user);
    await this.emailService.sendVerifyEmail(registerDto.email, userData.id);
  }
  
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ id: loginDto.id });

    if(!(user && await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('계정 정보를 확인해주세요.');
    }

    const payload = { id: user.id, email: user.email };

    if (loginDto.keepLogin) {
      return this.jwtService.sign(payload, { expiresIn: '48h' });
    }

    return this.jwtService.sign(payload, { expiresIn: '12h' });
  }

  async checkEmailVerificationStatus(id: string) {
    const data = await this.userRepository.findOne({ select: ['isEmailVerified'], where: { id } });

    if(!data) {
      throw new UnauthorizedException('존제하지 않는 유저입니다');
    }
    
    if(!data.isEmailVerified) {
      throw new UnauthorizedException('이메일 인증을 해주세요');
    }
  }
}
