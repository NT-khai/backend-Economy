import { Module } from '@nestjs/common';
import { AuthMoudle } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [PrismaModule, AuthMoudle],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
