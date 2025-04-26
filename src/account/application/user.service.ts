import { ConflictException, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "../domain/repositories/user.repository.interface";
import { User } from "../domain/entities/user";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) { }

    // Method to get a user by ID
    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    // Method to create a new user
    async createUser(userData: User): Promise<User> {
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
        await user.encryptPassword(userData.chiperText);

        const newUser = await this.userRepository.create(user);
        return newUser;
    }

    // Method to update an existing user's information
    async updateUser(id: string, userData: Partial<User>): Promise<User> {
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
        return this.userRepository.update(id, user);
    }

    // Method to delete a user by ID
    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.userRepository.delete(id);
    }

    // Method to find a user by email
    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    // Method to find a user by username
    async getUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findByUsername(username);
    }
}