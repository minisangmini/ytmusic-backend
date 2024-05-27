import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterDto {
  @ApiProperty({ example: 'userId', description: "회원가입 할 아이디" })
  @IsString()
  id: string;

  @ApiProperty({ example: 'userPassword', description: "회원가입 할 비밀번호" })
  @IsString()
  password: string;

  @ApiProperty({ example: 'example@exampme.com', description: "회원가입 할 이메일" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '기여운 미니상', description: "사용자 별명" })
  @IsString()
  nickname: string;
}
