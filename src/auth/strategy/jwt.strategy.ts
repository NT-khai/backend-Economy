import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // Lấy token từ cookie 'jwt'
          return req?.cookies?.acc_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.KEY!,
    });
  }

  async validate(payload: PayloadDto) {
    return {
      id: payload.id,
      full_name: payload.full_name,
      active: payload.active,
      role: payload.role,
    };
  }
}
