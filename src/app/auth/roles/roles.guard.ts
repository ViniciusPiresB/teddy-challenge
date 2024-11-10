import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/app/user/enum/user-type.enum';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const { authorization } = context.switchToHttp().getRequest().headers;

    let jwtToken = '';

    try {
      jwtToken = authorization.replace('Bearer ', '');
    } catch (error) {
      jwtToken = undefined;
    }

    const validJwt: JwtPayload | undefined = await this.jwtService.verifyAsync(jwtToken, { secret: process.env.JWT_SECRET }).catch(() => undefined);

    if (!validJwt) return false;

    return requiredRoles.some(role => role === validJwt.typeUser);
  }
}
