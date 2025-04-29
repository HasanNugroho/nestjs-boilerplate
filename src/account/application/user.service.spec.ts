import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, LoggerService, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../domain/repository/user.repository.interface';
import { User } from '../domain/user';
import { USER_REPOSITORY } from '../../common/constant';
import { UserService } from './user.service';
import { CreateUserDto } from '../presentation/dto/user.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


describe('UserService', () => {
    let service: UserService;
    let repository: jest.Mocked<IUserRepository>;

    beforeEach(async () => {
        const repositoryMock: jest.Mocked<IUserRepository> = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const loggerMock: jest.Mocked<LoggerService> = {
            error: jest.fn(),
            warn: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            fatal: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: USER_REPOSITORY,
                    useValue: repositoryMock,
                },
                {
                    provide: WINSTON_MODULE_NEST_PROVIDER,
                    useValue: loggerMock,
                },
                UserService,
            ],
        }).compile();

        repository = module.get(USER_REPOSITORY);
        service = module.get(UserService);
    });


    describe('getById', () => {
        it('should return user when found', async () => {
            const user = new User();
            repository.findById.mockResolvedValueOnce(user);

            const result = await service.getById('user-id');

            expect(result).toBe(user);
            expect(repository.findById).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.findById.mockResolvedValueOnce(null);

            await expect(service.getById('wrong-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a user when email is not taken', async () => {
            const data = new CreateUserDto()
            data.email = 'jane@example.com'
            data.username = 'jhondoe'
            data.fullname = 'jon doe'
            data.name = 'joi'
            data.password = 'password123'
            repository.findByEmail.mockResolvedValueOnce(null);
            repository.create.mockImplementation(undefined);

            await expect(service.create(data)).resolves.not.toThrow();
            expect(repository.findByEmail).toHaveBeenCalledWith('jane@example.com');
            expect(repository.create).toHaveBeenCalled();
        });

        it('should throw ConflictException if email already exists', async () => {
            repository.findByEmail.mockResolvedValueOnce(new User());

            const user = new CreateUserDto()
            user.email = 'jane@example.com'
            user.username = 'jhondoe'
            user.fullname = 'jon doe'
            user.name = 'joi'
            user.password = 'password123'

            await expect(service.create(user)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update and return updated user', async () => {
            const user = new User();
            user.id = 'user-id';
            repository.findById.mockResolvedValueOnce(user);
            repository.update.mockImplementation(async (_id: string, u: User) => u);

            await service.update('user-id', { name: 'New Name' });
            expect(repository.update).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user not found for update', async () => {
            repository.findById.mockResolvedValueOnce(null);

            await expect(service.update('wrong-id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete user if exists', async () => {
            const user = new User();
            repository.findById.mockResolvedValueOnce(user);
            repository.delete.mockResolvedValueOnce();

            await service.delete('user-id');

            expect(repository.delete).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundException if user to delete not found', async () => {
            repository.findById.mockResolvedValueOnce(null);

            await expect(service.delete('wrong-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getByEmail', () => {
        it('should return user by email', async () => {
            const user = new User();
            repository.findByEmail.mockResolvedValueOnce(user);

            const result = await service.getByEmail('john@example.com');

            expect(result).toBe(user);
            expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.findById.mockResolvedValueOnce(null);

            await expect(service.getByEmail('wrong-email')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getByUsername', () => {
        it('should return user by username', async () => {
            const user = new User();
            repository.findByUsername.mockResolvedValueOnce(user);

            const result = await service.getByUsername('johndoe');

            expect(result).toBe(user);
            expect(repository.findByUsername).toHaveBeenCalledWith('johndoe');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.findById.mockResolvedValueOnce(null);

            await expect(service.getByUsername('wrong-username')).rejects.toThrow(NotFoundException);
        });
    });
});
