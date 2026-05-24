import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.products.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' }, // sắp xếp theo id
      }),
      this.prisma.products.count(),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductDetail(id: number) {
    const findID = await this.prisma.products.findUnique({ where: { id: id } });
    if (!findID) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return findID;
  }

  // Thêm sản phẩm
  async createProduct(data: CreateProductDto) {
    return this.prisma.products.create({ data });
  }

  // Sửa sản phẩm
  async updateProduct(id: number, data: UpdateProductDto) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return this.prisma.products.update({
      where: { id },
      data,
    });
  }

  // Xóa sản phẩm
  async deleteProduct(id: number) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return this.prisma.products.delete({ where: { id } });
  }

  async getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.products.findMany({
        where: { category },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.products.count({ where: { category } }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
