import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from './role';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy metadata từ decorator @Roles
    const requiredRoles: string[] = this.reflector.get<string[]>(
      ROLE,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // nếu route không yêu cầu role thì cho qua
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // user đã được JwtStrategy validate

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Kiểm tra role của user có nằm trong requiredRoles không
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('User does not have required role');
    }

    return true;
  }
}
