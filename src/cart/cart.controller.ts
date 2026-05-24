import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { type Request } from 'express';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: Request) {
    const user = req.user as PayloadDto;
    return this.cartService.getCart(user.id!);
  }

  @Post('items')
  addItem(@Req() req: Request, @Body() dto: AddCartItemDto) {
    const user = req.user as PayloadDto;
    return this.cartService.addItem(user.id!, dto);
  }

  @Patch('items/:productId/decrement')
  decrementItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const user = req.user as PayloadDto;
    return this.cartService.decrementItem(user.id!, productId);
  }

  @Delete('items/:productId')
  removeItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const user = req.user as PayloadDto;
    return this.cartService.removeItem(user.id!, productId);
  }
}
