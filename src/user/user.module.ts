import { Module } from '@nestjs/common';
import { AuthMoudle } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule, AuthMoudle],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
