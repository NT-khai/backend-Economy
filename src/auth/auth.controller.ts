import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { type Response } from 'express';
import { type Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PayloadDto } from './dto/payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setAuthCookie(res: Response, token: string) {
    res.cookie('acc_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user = req.user as PayloadDto;
    const token = await this.authService.login(user);
    this.setAuthCookie(res, token);

    return res.json({
      message: 'Login thành công',
      user: this.authService.sanitizePayload(user),
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async adminLogin(@Req() req: Request, @Res() res: Response) {
    const user = req.user as PayloadDto;

    if (user.role !== 'admin') {
      throw new ForbiddenException('Chỉ tài khoản admin được phép đăng nhập');
    }

    const token = await this.authService.login(user);
    this.setAuthCookie(res, token);

    return res.json({
      message: 'Admin login thành công',
      user: this.authService.sanitizePayload(user),
    });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('acc_token');
    return res.json({ message: 'Đã đăng xuất' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user: PayloadDto = req.user!;
    return this.authService.getProfile(user.id!);
  }
}
