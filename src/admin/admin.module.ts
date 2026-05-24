import { Module } from '@nestjs/common';
import { AuthMoudle } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [PrismaModule, AuthMoudle],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
