import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from "../domain/repository/user.repository.interface";
import { User } from "../domain/entities/user";
import { IUserService } from '../domain/service/user.service.interface';
import { CreateUserDto } from '../domain/dto/user.dto';
import { USER_REPOSITORY } from 'src/shared/constant';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
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
    async create(userData: CreateUserDto): Promise<User> {
        // Check if the email or username already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const user = new User();
        user.name = userData.name;
        user.fullname = userData.fullname;
        user.email = userData.email;
        user.username = userData.username;

        // Encrypt password before saving the user
        await user.encryptPassword(userData.password);

        const newUser = await this.userRepository.create(user);
        return newUser;
    }

    // Method to update an existing user's information
    async update(id: string, userData: Partial<User>): Promise<User> {
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
        const updatedUser = await this.userRepository.update(id, user);

        if (!updatedUser) {
            throw new NotFoundException(`Failed to update user with ID ${id}`);
        }

        return updatedUser;
    }

    // Method to delete a user by ID
    async delete(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.userRepository.delete(id);
    }
}