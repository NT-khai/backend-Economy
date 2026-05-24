import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  Get,
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.login(req.user!);

    // Lưu token vào cookie
    res.cookie('acc_token', token, {
      httpOnly: true, // bảo mật, không cho JS truy cập
      secure: true, // chỉ gửi qua HTTPS
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1h
    });

    console.log(req.user);
    console.log(req.cookies.acc_token);

    return res.json({ message: 'Login thành công' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log(registerDto);
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user: PayloadDto = req.user!;
    console.log(user);
    return this.authService.getProfile(user.id!);
  }
}
