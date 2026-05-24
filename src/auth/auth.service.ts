import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PayloadDto } from './dto/payload.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(payload: PayloadDto) {
    return await this.jwt.sign(payload);
  }

  async validate(email: string, password: string): Promise<PayloadDto> {
    const checkEmail = await this.prisma.users.findFirst({
      where: { email: email },
    });

    if (!checkEmail) {
      throw new UnauthorizedException('Email khong ton tai');
    }

    const checkPass = await bcrypt.compare(password, checkEmail.password);
    if (!checkPass) {
      throw new UnauthorizedException('Mat Khau khong chinh xac');
    }

    const payload: PayloadDto = {
      id: checkEmail.id,
      full_name: checkEmail.full_name,
      active: checkEmail.active!,
      role: checkEmail.role!,
    };

    return payload;
  }

  // Hàm register user mới
  async register(data: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.users.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(data.password!, 10);

    // Tạo user mới
    const user = await this.prisma.users.create({
      data: {
        full_name: data.full_name!,
        email: data.email!,
        password: hashedPassword,
      },
    });

    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        active: user.active,
      },
    };
  }

  async getProfile(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
    });
    return user;
  }
}
