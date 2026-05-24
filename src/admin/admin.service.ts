import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalProducts, totalCarts, totalCartItems] =
      await Promise.all([
        this.prisma.users.count(),
        this.prisma.products.count(),
        this.prisma.carts.count(),
        this.prisma.cart_items.count(),
      ]);

    const [adminCount, activeUsers] = await Promise.all([
      this.prisma.users.count({ where: { role: 'admin' } }),
      this.prisma.users.count({ where: { active: true } }),
    ]);

    const recentProducts = await this.prisma.products.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
    });

    const recentUsers = await this.prisma.users.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        active: true,
        created_at: true,
      },
    });

    return {
      totalUsers,
      totalProducts,
      totalCarts,
      totalCartItems,
      adminCount,
      activeUsers,
      recentProducts,
      recentUsers,
    };
  }
}
