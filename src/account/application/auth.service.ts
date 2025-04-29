import { BadRequestException, ConflictException, Inject, Injectable, LoggerService, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from "../domain/repository/user.repository.interface";
import { USER_REPOSITORY } from 'src/common/constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IAuthService } from '../domain/service/auth.service.interface';
import { Credential, CredentialResponse } from '../domain/credential';
import { User } from '../domain/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,

        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(credential: Credential): Promise<CredentialResponse> {
        const credentialInstance = plainToInstance(Credential, credential);
        const identifier = credentialInstance.identifier;
        const password = credentialInstance.password;

        try {
            const user = credentialInstance.isEmailIdentifier()
                ? await this.userRepository.findByEmail(identifier)
                : await this.userRepository.findByUsername(identifier);

            if (!user) {
                throw new UnauthorizedException('Invalid identifier or password');
            }

            const isPasswordValid = await user.validatePasswordHash(password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid identifier or password');
            }

            return this.generateTokens(user.id);
        } catch (error) {
            this.logger.error(`Unable to login [identifier=${credential.identifier}]`, error.stack);
            throw new BadRequestException('Invalid identifier or password');
        }
    }

    async logout(): Promise<void> {
        throw new BadRequestException(`logout not implemented`);
    }

    async refreshToken(userId: string, refreshToken: string): Promise<CredentialResponse> {
        throw new BadRequestException(`refresh token not implemented`);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
    }

    private async generateTokens(id: string): Promise<CredentialResponse> {
        const tokenExpiresIn = this.configService.get<string>('jwt.expired');
        const refreshExpiresIn = this.configService.get<string>('jwt.refresh_expired');

        const payload = { id };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: tokenExpiresIn,
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: refreshExpiresIn,
            notBefore: tokenExpiresIn,
        });

        return new CredentialResponse(accessToken, refreshToken, id);
    }

}