import { BadRequestException, ConflictException, Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { IUserService } from '../domain/service/user.service.interface';
import { IUserRepository } from "../domain/repository/user.repository.interface";
import { USER_REPOSITORY } from 'src/shared/constant';
import { User } from "../domain/entities/user";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) { }


    // Method to get a user by ID
    async getById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async getByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user;
    }

    async getByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        return user;
    }

    // Method to create a new user
    async create(user: User): Promise<User> {
        // Check if the email or username already exists
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            this.logger.error(`Unable to create user [email=${user.email}]`);
            throw new BadRequestException('Email is already in use');
        }

        // Encrypt password before saving the user
        await user.encryptPassword(user.chiperText);

        try {
            return await this.userRepository.create(user);
        } catch (error) {
            this.logger.error(`Unable to create user [email=${user.email}]: ${error.message}`, error.stack);

            if (error.code === '23505') { // Unique violation error code
                throw new ConflictException('Email or username already exists');
            } else {
                throw new BadRequestException('Failed to create user');
            }
        }
    }

    // Method to update an existing user's information
    async update(id: string, userData: Partial<User>): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Update the user fields
        user.name = userData.name || user.name;
        user.fullname = userData.fullname || user.fullname;
        user.email = userData.email || user.email;
        user.username = userData.username || user.username;

        // If password is provided, encrypt and update it
        if (userData.chiperText) {
            await user.encryptPassword(userData.chiperText);
        }

        // Save the updated user
        try {
            const updatedUser = await this.userRepository.update(id, user);
            if (!updatedUser) {
                throw new NotFoundException(`Failed to update user with ID ${id}`);
            }
        } catch (error) {
            this.logger.error('Unable to update user', error.stack);
            throw new BadRequestException('Failed to update user'); {
            }
        }
    }

    // Method to delete a user by ID
    async delete(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        try {
            await this.userRepository.delete(id);
        } catch (error) {
            this.logger.error('Unable to delete user', error.stack);
            throw new BadRequestException('Failed to delete user');
        }
    }
}