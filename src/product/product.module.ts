import { Module } from '@nestjs/common';
import { AuthMoudle } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [PrismaModule, AuthMoudle],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
