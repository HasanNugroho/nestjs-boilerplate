import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserService } from '../domain/service/user.service.interface';
import { User } from '../domain/user';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AUTH_SERVICE } from 'src/common/constant';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UuidParamDto } from 'src/common/dto/filter.dto';
import { ApiResponse } from 'src/common/dto/response.dto';
import { IAuthService } from '../domain/service/auth.service.interface';
import { Credential } from '../domain/credential';

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
    @Post()
    async create(@Body() payload: Credential) {
        try {
            const result = await this.authService.login(payload);
            return new ApiResponse(HttpStatus.OK, true, "user logged successfully", result)
        } catch (error) {
            throw error;
        }
    }


}
