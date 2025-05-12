import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ApiOperation, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AUTH_SERVICE } from 'src/common/constant';
import { HttpResponse } from 'src/common/dtos/response.dto';
import { IAuthService } from '../domain/service/auth.service.interface';
import { Credential } from '../domain/credential';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '../domain/user';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('api/auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: IAuthService
    ) { }

    @ApiOperation({ summary: 'Login' })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @ApiUnauthorizedResponse({
        description: "invalid identifier or password",
    })
    @Public()
    @Post()
    async create(@Body() payload: Credential) {
        try {
            const result = await this.authService.login(payload);
            return new HttpResponse(HttpStatus.OK, true, "user logged successfully", result)
        } catch (error) {
            throw error;
        }
    }

    @ApiBearerAuth()
    @Get('me')
    async me(@CurrentUser() user: User) {
        return new HttpResponse(200, true, 'fetch user successfully', user.toResponse())
    }
}
