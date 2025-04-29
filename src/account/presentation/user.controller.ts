import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserService } from '../domain/service/user.service.interface';
import { User } from '../domain/entities/user';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { USER_SERVICE } from 'src/common/constant';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UuidParamDto } from 'src/common/dto/filter.dto';

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
        return await this.userService.create(payload);
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Get(':id')
    async getById(@Param() id: UuidParamDto) {
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
    async update(@Param() id: UuidParamDto, @Body() userData: UpdateUserDto) {
        return this.userService.update(id.id, userData);
    }

    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Delete(':id')
    async delete(@Param() id: UuidParamDto) {
        return this.userService.delete(id.id);
    }
}
