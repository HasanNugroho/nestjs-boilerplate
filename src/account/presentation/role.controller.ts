import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ROLE_SERVICE } from 'src/common/constant';
import { IRoleService } from '../domain/service/role.service.interface';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { BaseQueryDto, UuidParamDto } from 'src/common/dto/filter.dto';


@Controller('api/roles')
export class RoleController {
    constructor(
        @Inject(ROLE_SERVICE)
        private readonly roleService: IRoleService
    ) { }

    @ApiOperation({ summary: 'Endpoint for create role' })
    @ApiCreatedResponse({
        description: "Response success create role",
        type: CreateRoleDto,
        isArray: false,
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @ApiBadRequestResponse({
        description: "validation error",
    })
    @Post()
    async create(@Body() payload: CreateRoleDto) {

        return await this.roleService.create(payload);
    }

    @ApiOperation({ summary: 'Get roles' })
    @ApiNotFoundResponse({
        description: "roles not found",
    })
    @Get()
    async getAll(@Query() filter: BaseQueryDto) {
        return await this.roleService.getAll(filter);
    }

    @ApiOperation({ summary: 'Get role by ID' })
    @ApiNotFoundResponse({
        description: "role not found",
    })
    @Get(':id')
    async getById(@Param() id: UuidParamDto) {
        return await this.roleService.getById(id.id);
    }

    @ApiOperation({ summary: 'Update role by ID' })
    @ApiNotFoundResponse({
        description: "role not found",
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @Put(':id')
    async update(@Param() id: UuidParamDto, @Body() roleData: UpdateRoleDto) {
        return this.roleService.update(id.id, roleData);
    }

    @ApiOperation({ summary: 'Delete role by ID' })
    @ApiNotFoundResponse({
        description: "role not found",
    })
    @Delete(':id')
    async delete(@Param() id: UuidParamDto) {
        return this.roleService.delete(id.id);
    }
}
