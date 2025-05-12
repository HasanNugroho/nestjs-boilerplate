
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IRoleRepository } from 'src/account/domain/repository/role.repository.interface';
import { IUserRepository } from 'src/account/domain/repository/user.repository.interface';
import { IS_PUBLIC_KEY, ROLE_REPOSITORY, USER_REPOSITORY } from 'src/common/constant';
import * as rolesJson from 'src/config/permissions.json';

var _ = require('lodash');

const defaultRoles: string[] = rolesJson.default_permission;

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,

        private jwtService: JwtService,
        private reflector: Reflector,
        private configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { status: isPublic, roles = [] } = this.validatePublicRoles(context);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not provided or malformed');
        }

        try {
            const secret = this.configService.get<string>('jwt.secret');
            const payload = await this.jwtService.verifyAsync(token, { secret });

            const user = await this.userRepository.getById(payload.id);
            if (!user) throw new UnauthorizedException('User not found');

            const userRole = await this.roleRepository.findById(user.role_id);
            const roleNames: string[] = userRole?.access ? JSON.parse(userRole.access) : defaultRoles;

            if (roles.length && _.intersection(roles, roleNames).length === 0) {
                throw new ForbiddenException('User does not have required roles');
            }

            request['user'] = user;
            return true;

        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private validatePublicRoles(context: ExecutionContext): { status: boolean, roles: string[] } {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            if (roles && _.intersection(roles, defaultRoles).length > 0) { return { status: false, roles } }

            return { status: true, roles };
        }

        return { status: false, roles };
    }
}
