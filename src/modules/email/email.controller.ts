import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiExcludeEndpoint()
  @Get('/:email/verification')
  async emailVerification(@Param('email') email: string, @Query('id') id: string) {
    try {
      await this.emailService.emailVerify(email, id);
      return '성공'
    } catch(err) {
      return '잘못된 접근입니다'
    }
  }
}
