import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: '회원가입', description: '회원가입을 합니다' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: '회원가입 성공한 경우' })
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          '이미 존재하는 아이디': {
            description: '이미 존재하는 아이디일 경우'
          },
          '이미 존재하는 이메일': {
            description: '이미 존재하는 이메일일 경우'
          }
        }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: '로그인', description: '로그인을 합니다' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'jwt 토큰을 반환합니다(keepLogin===true ? 48h : 12h)', type: String })
  @ApiUnauthorizedResponse({ description: '계정 정보가 맞지 않은 경우' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/email/verification-status')
  @ApiOperation({ summary: '이메일 인증 검사', description: '이메일 인증을 하였는 지 검사합니다' })
  @ApiOkResponse({ description: '메일 인증이 완료된 경우' })
  @ApiUnauthorizedResponse({
    content: {
      'application/json': {
        examples: {
          '존재하지 않는 유저': {
            description: '존재하지 않는 유저일 경우'
          },
          '메일 미인증': {
            description: '메일 인증이 되어 있지 않는 경우'
          }
        }
      }
    }
  })
  async checkMail(@Req() req) {
    await this.authService.checkEmailVerificationStatus(req.user.userId);
  }
}
