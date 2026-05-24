import { SetMetadata } from '@nestjs/common';
export const ROLE = 'role@#';
export const Roles = (role: string[]) => SetMetadata(ROLE, role);
