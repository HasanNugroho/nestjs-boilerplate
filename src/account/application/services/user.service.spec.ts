import { UserService } from './user.service';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constant';
import { TestBed, Mocked } from '@suites/unit';
import { User } from 'src/account/domain/user';
import { IUserRepository } from 'src/account/domain/repository/user.repository.interface';
import { CreateUserDto, UpdateUserDto } from 'src/account/presentation/dto/user.dto';

describe('UserService', () => {
    let service: UserService;
    let repository: Mocked<IUserRepository>;

    beforeEach(async () => {
        const { unit, unitRef } = await TestBed.solitary(UserService).compile();
        service = unit;
        repository = unitRef.get(USER_REPOSITORY);
    });

    describe('getById', () => {
        it('should return user when found by id', async () => {
            const user = new User();
            repository.getById.mockResolvedValueOnce(user);

            const result = await service.getById('user-id');

            expect(result).toEqual(user);
            expect(repository.getById).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.getById.mockResolvedValueOnce(null);

            await expect(service.getById('wrong-id')).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if error', async () => {
            repository.getById.mockRejectedValueOnce(new InternalServerErrorException());

            await expect(service.getById('wrong-id')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getByEmail', () => {
        it('should return user when found by email', async () => {
            const user = new User();
            repository.getByEmail.mockResolvedValueOnce(user);

            const result = await service.getByEmail('user-id');

            expect(result).toEqual(user);
            expect(repository.getByEmail).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundException if user not found', async () => {
            repository.getByEmail.mockResolvedValueOnce(null);

            await expect(service.getByEmail('wrong-id')).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if error', async () => {
            repository.getByEmail.mockRejectedValueOnce(new InternalServerErrorException());

            await expect(service.getByEmail('wrong-id')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('create', () => {
        it('should return user when successfully created user', async () => {
            const createUserDto: CreateUserDto = {
                username: 'newuser',
                email: 'newuser@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
            };

            const savedUser = new User();
            savedUser.email = createUserDto.email;
            savedUser.name = createUserDto.name;
            savedUser.fullname = createUserDto.fullname;
            savedUser.chiperText = 'hashedPassword';
            savedUser.id = 'new-user-id';

            repository.getByEmail.mockResolvedValueOnce(null);
            repository.create.mockResolvedValueOnce(savedUser);

            const result = await service.create(createUserDto);

            expect(result).toBeDefined();
            expect(repository.getByEmail).toHaveBeenCalledWith(createUserDto.email);
            expect(repository.create).toHaveBeenCalledWith(expect.any(User));
        });

        it('should throw BadRequestException when email exists', async () => {
            const createUserDto: CreateUserDto = {
                username: 'existing',
                email: 'existing@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
            };

            const existingUser = new User();
            existingUser.email = createUserDto.email;

            repository.getByEmail.mockResolvedValueOnce(existingUser);

            await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
            expect(repository.getByEmail).toHaveBeenCalledWith(createUserDto.email);
        });
    });

    describe('update', () => {
        it('should update user successfully ', async () => {
            const savedUser = new User();
            savedUser.email = "exist@example.com";
            savedUser.name = "Existing User";
            savedUser.fullname = "Existing Full User";
            savedUser.chiperText = '$2a$12$dU41iYBbB2BQXVVnoY6iauuVS9WZfst5wYV8KLyW9ltH3mZZR.cH.';
            savedUser.id = 'existing-user-id';

            const updatesUserDto: UpdateUserDto = {
                email: 'exist@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
            };

            repository.getById.mockResolvedValueOnce(savedUser);
            repository.update.mockResolvedValueOnce(null);

            const result = await service.update(savedUser.id, updatesUserDto);

            expect(result).toBe(undefined);
        });

        it('should not return when change email successfully ', async () => {
            const savedUser = new User();
            savedUser.email = "exist@example.com";
            savedUser.name = "Existing User";
            savedUser.fullname = "Existing Full User";
            savedUser.chiperText = '$2a$12$dU41iYBbB2BQXVVnoY6iauuVS9WZfst5wYV8KLyW9ltH3mZZR.cH.';
            savedUser.id = 'existing-user-id';

            const updatesUserDto: UpdateUserDto = {
                email: 'new-email@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
            };

            repository.getById.mockResolvedValueOnce(savedUser);
            repository.getByEmail.mockResolvedValueOnce(null);
            repository.update.mockResolvedValueOnce(null);

            const result = await service.update(savedUser.id, updatesUserDto);

            expect(result).toEqual(null);
            expect(repository.getByEmail).toHaveBeenCalledWith('new-email@example.com');
        });

        it('should throw BadRequestException when changed email duplicate ', async () => {
            const savedUser = new User();
            savedUser.email = "exist@example.com";
            savedUser.name = "Existing User";
            savedUser.fullname = "Existing Full User";
            savedUser.chiperText = '$2a$12$dU41iYBbB2BQXVVnoY6iauuVS9WZfst5wYV8KLyW9ltH3mZZR.cH.';
            savedUser.id = 'existing-user-id';

            const updatesUserDto: UpdateUserDto = {
                email: 'new-email@example.com',
                name: 'New User',
                fullname: 'New Full User',
                password: 'password',
            };

            const existingEmailUser = new User();
            existingEmailUser.email = "new-email@example.com";
            existingEmailUser.id = 'another-user-id'; // pastikan id berbeda!

            repository.getById.mockResolvedValueOnce(savedUser);
            repository.getByEmail.mockResolvedValueOnce(existingEmailUser);

            await expect(service.update(savedUser.id, updatesUserDto)).rejects.toThrow(BadRequestException);
        });
    });

});
