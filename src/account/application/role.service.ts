import { BadRequestException, ConflictException, Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../domain/repository/role.repository.interface';
import { IRoleService } from '../domain/service/role.service.interface';
import { ROLE_REPOSITORY } from 'src/common/constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Role } from '../domain/entities/role';
import { CreateRoleDto, UpdateRoleDto } from '../presentation/dto/role.dto';
import { BaseQueryDto } from 'src/common/dto/filter.dto';

@Injectable()
export class RoleService implements IRoleService {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,

        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) { }


    /**
     * Fetch a role by its unique ID.
     * @param id - The ID of the role to retrieve.
     * @returns A promise that resolves to the role object.
     * @throws NotFoundException if the role is not found.
     */
    async getById(id: string): Promise<Role> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    /**
     * Fetch all roles with a pagination filter.
     * @param filter - The pagination filter.
     * @returns A promise that resolves to the list of roles and the total count.
     */
    async getAll(filter: BaseQueryDto): Promise<{ roles: Role[], totalCount: number }> {
        const { roles, totalCount } = await this.roleRepository.findAll(filter);
        return { roles, totalCount };
    }

    /**
     * Create a new role.
     * @param roleData - The data of the role to create.
     * @returns A promise that resolves to the newly created role object.
     * @throws ConflictException if the role name already exists.
     */
    async create(roleData: CreateRoleDto): Promise<void> {
        const role = new Role().new(roleData.name, roleData.description, roleData.access);

        if (!role.validatePermissions()) {
            throw new BadRequestException('Invalid permissions provided.');
        }

        try {
            this.roleRepository.create(role);
            return
        } catch (error) {
            this.logger.error(`Unable to role [name=${role.name}]: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Update an existing role's details.
     * @param id - The ID of the role to update.
     * @param roleData - The new data to update the role with.
     * @returns A promise that resolves when the role has been updated.
     * @throws NotFoundException if the role is not found.
     */
    async update(id: string, roleData: UpdateRoleDto): Promise<void> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }

        role.name = roleData.name || role.name;
        role.description = roleData.description || role.description;
        role.isActive = roleData.isActive || role.isActive;

        if (roleData.access) {
            role.access = JSON.stringify(roleData.access);

            if (!role.validatePermissions()) {
                throw new BadRequestException('Invalid permissions provided.');
            }
        }

        try {
            await this.roleRepository.update(id, role);
            return
        } catch (error) {
            this.logger.error('Unable to update role', error.stack);
            throw new BadRequestException('Failed to update role'); {
            }
        }
    }

    /**
     * Delete a role by its ID.
     * @param id - The ID of the role to delete.
     * @returns A promise that resolves when the role has been deleted.
     * @throws NotFoundException if the role is not found.
     */
    async delete(id: string): Promise<void> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }

        // Delete the role
        await this.roleRepository.delete(id);
    }
}