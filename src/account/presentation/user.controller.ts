import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserService } from '../domain/service/user.service.interface';
import { CreateUserDto } from '../domain/dto/user.dto';
import { User } from '../domain/entities/user';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { USER_SERVICE } from 'src/shared/constant';
import { UuidParamDto } from 'src/common/dto/uuid-param.dto';

@Controller('api/users')
export class UserController {
    constructor(
        @Inject(USER_SERVICE)
        private readonly userService: IUserService
    ) { }

    @ApiOperation({ summary: 'Endpoint untuk create user' })
    @ApiCreatedResponse({
        description: "Response success create user",
        type: User,
        isArray: false,
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @ApiConflictResponse({
        description: "Email or username already exists",
    })
    @Post()
    async create(@Body() payload: CreateUserDto) {
        const user = new User();
        user.new(payload.email, payload.fullname, payload.username, payload.email, payload.password);
        const result = await this.userService.create(user);

        return result.toResponseObject();
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Get(':id')
    async getById(@Param('id') id: UuidParamDto) {
        const user = await this.userService.getById(id.id);
        return user.toResponseObject();
    }

    @ApiOperation({ summary: 'Update user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @Put(':id')
    async update(@Param('id') id: UuidParamDto, @Body() userData: Partial<User>) {
        return this.userService.update(id.id, userData);
    }

    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Delete(':id')
    async delete(@Param('id') id: UuidParamDto) {
        return this.userService.delete(id.id);
    }
}
