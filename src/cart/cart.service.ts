import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    if (!cart) {
      cart = await this.prisma.carts.create({
        data: { user_id: userId },
      });
    }

    return cart;
  }

  private mapCartItems(
    cartItems: {
      id: number;
      product_id: number;
      qty: number | null;
      price: { toString(): string };
      products: {
        title: string;
        image: string | null;
        description: string | null;
        category: string | null;
      };
    }[],
  ) {
    return cartItems.map((item) => ({
      cartItemId: item.id,
      id: item.product_id,
      qty: item.qty ?? 1,
      price: Number(item.price),
      title: item.products.title,
      image: item.products.image,
      description: item.products.description,
      category: item.products.category,
    }));
  }

  async getCart(userId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        cart_items: {
          include: { products: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!cart) {
      return { cartId: null, items: [] };
    }

    return {
      cartId: cart.id,
      items: this.mapCartItems(cart.cart_items),
    };
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.prisma.products.findUnique({
      where: { id: dto.product_id },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const qtyToAdd = dto.qty ?? 1;
    const existing = await this.prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: dto.product_id,
      },
    });

    if (existing) {
      await this.prisma.cart_items.update({
        where: { id: existing.id },
        data: { qty: (existing.qty ?? 0) + qtyToAdd },
      });
    } else {
      await this.prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: dto.product_id,
          qty: qtyToAdd,
          price: product.price,
        },
      });
    }

    return this.getCart(userId);
  }

  async decrementItem(userId: number, productId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    if (!cart) {
      return { cartId: null, items: [] };
    }

    const item = await this.prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (!item) {
      return this.getCart(userId);
    }

    if ((item.qty ?? 1) <= 1) {
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    } else {
      await this.prisma.cart_items.update({
        where: { id: item.id },
        data: { qty: (item.qty ?? 1) - 1 },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    if (!cart) {
      return { cartId: null, items: [] };
    }

    const item = await this.prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (item) {
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getCart(userId);
  }
}
