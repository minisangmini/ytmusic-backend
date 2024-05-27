import { Module, forwardRef } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailEntity } from './entities/email.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailController } from './email.controller';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailEntity, UserEntity]),
    forwardRef(() => AuthModule)
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService]
})
export class EmailModule {}
