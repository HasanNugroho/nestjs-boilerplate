import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, LoggerService, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../../common/constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RoleService } from './role.service';
import { IRoleRepository } from '../../domain/repository/role.repository.interface';
import { Role } from '../../domain/role';
import { CreateRoleDto, UpdateRoleDto } from '../../presentation/dto/role.dto';
import { PaginationOptionsDto } from 'src/common/dto/page-option.dto';
import { Order } from 'src/common/enums/order.enum';

describe('RoleService', () => {
    let service: RoleService;
    let repository: jest.Mocked<IRoleRepository>;

    beforeEach(async () => {
        // Create repository mock with all required methods
        const repositoryMock: jest.Mocked<IRoleRepository> = {
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findManyById: jest.fn()
        };

        // Create logger mock with all required methods
        const loggerMock: jest.Mocked<LoggerService> = {
            error: jest.fn(),
            warn: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            fatal: jest.fn(),
        };

        // Create and configure testing module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ROLE_REPOSITORY,
                    useValue: repositoryMock,
                },
                {
                    provide: WINSTON_MODULE_NEST_PROVIDER,
                    useValue: loggerMock,
                },
                RoleService,
            ],
        }).compile();

        // Get repository and service instances
        repository = module.get(ROLE_REPOSITORY);
        service = module.get(RoleService);
    });

    describe('getById', () => {
        it('should return role when found', async () => {
            // Arrange
            const role = new Role();
            role.name = 'admin';
            role.description = 'admin desc';
            role.access = JSON.stringify([
                "manage:system",
                "roles:create",
                "roles:read"
            ]);
            repository.findById.mockResolvedValueOnce(role);

            // Act
            const result = await service.getById('role-id');

            // Assert
            expect(result).toBe(role);
            expect(repository.findById).toHaveBeenCalledWith('role-id');
        });

        it('should throw NotFoundException if role not found', async () => {
            // Arrange
            repository.findById.mockResolvedValueOnce(null);

            // Act & Assert
            await expect(service.getById('wrong-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getAll', () => {
        it('should return roles when found', async () => {
            // Arrange
            const role = new Role();
            role.name = 'admin';
            role.description = 'admin desc';
            role.access = JSON.stringify([
                "manage:system",
                "roles:create",
                "roles:read"
            ]);
            const expectedResult = { roles: [role], totalCount: 1 };
            repository.findAll.mockResolvedValueOnce(expectedResult);

            const filter = new PaginationOptionsDto()
            filter.page = 1
            filter.limit = 10
            filter.orderby = 'created_at';
            filter.order = Order.ASC;

            // Act
            const result = await service.getAll(filter);

            // Assert
            expect(result).toEqual(expectedResult);
            expect(repository.findAll).toHaveBeenCalledWith(filter);
        });
    });

    describe('create', () => {
        it('should create a role successfully', async () => {
            // Arrange
            const data = new CreateRoleDto();
            data.name = 'admin';
            data.description = 'admin desc';
            data.access = [
                "manage:system",
                "roles:create",
                "roles:read"
            ];
            repository.create.mockImplementation(async (role: Role) => role);

            // Act & Assert
            await expect(service.create(data)).resolves.not.toThrow();
            expect(repository.create).toHaveBeenCalled();
        });

        it('should throw BadRequestException if permission not valid', async () => {
            // Arrange
            const data = new CreateRoleDto();
            data.name = 'admin';
            data.description = 'admin desc';
            data.access = [
                "manage:system",
                "roles:slice", // Invalid permission
                "roles:read"
            ];
            repository.create.mockResolvedValueOnce(new Role());

            // Act & Assert
            await expect(service.create(data)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update and return updated role', async () => {
            // Arrange
            const role = new Role();
            role.id = 'role-id';
            repository.findById.mockResolvedValueOnce(role);
            repository.update.mockImplementation(async () => Promise.resolve());

            // Act
            await service.update('role-id', { name: 'New Name' });

            // Assert
            expect(repository.update).toHaveBeenCalled();
        });

        it('should throw BadRequestException if role permission invalid', async () => {
            // Arrange
            const role = new Role();
            role.id = 'role-id';
            repository.findById.mockResolvedValueOnce(role);

            const updatedData = new UpdateRoleDto();
            updatedData.name = 'admin';
            updatedData.description = 'admin desc';
            updatedData.access = [
                "manage:system",
                "roles:slice",
                "roles:read"
            ];

            // Act & Assert
            await expect(service.update('role-id', updatedData)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if role not found for update', async () => {
            // Arrange
            repository.findById.mockResolvedValueOnce(null);

            // Act & Assert
            await expect(service.update('wrong-id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete role if exists', async () => {
            // Arrange
            const role = new Role();
            repository.findById.mockResolvedValueOnce(role);
            repository.delete.mockResolvedValueOnce();

            // Act
            await service.delete('role-id');

            // Assert
            expect(repository.delete).toHaveBeenCalledWith('role-id');
        });

        it('should throw NotFoundException if role to delete not found', async () => {
            // Arrange
            repository.findById.mockResolvedValueOnce(null);

            // Act & Assert
            await expect(service.delete('wrong-id')).rejects.toThrow(NotFoundException);
        });
    });
});