import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginDto {
  @ApiProperty({ example: 'userId', description: "로그인 할 아이디" })
  @IsString()
  id: string;

  @ApiProperty({ example: 'userPassword', description: "로그인 할 비밀번호" })
  @IsString()
  password: string;

  @ApiProperty({ example: 'true', description: "로그인 유지 여부" })
  @IsNotEmpty()
  keepLogin: boolean;
}
