import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/guards/role/role';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Lấy danh sách sản phẩm (ai cũng xem được) + lọc theo category
  @Get()
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('category') category?: string,
  ) {
    if (category) {
      return this.productService.getProductsByCategory(
        category,
        Number(page),
        Number(limit),
      );
    }
    return this.productService.getProducts(Number(page), Number(limit));
  }

  // Lấy chi tiết sản phẩm
  @Get(':id')
  async getProductDetail(@Param('id') id: number) {
    return this.productService.getProductDetail(Number(id));
  }

  // Thêm sản phẩm (chỉ admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  // Sửa sản phẩm (chỉ admin)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(Number(id), dto);
  }

  // Xóa sản phẩm (chỉ admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(Number(id));
  }
}
