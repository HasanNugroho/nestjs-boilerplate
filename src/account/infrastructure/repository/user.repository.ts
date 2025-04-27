import { Injectable } from '@nestjs/common';
import { User } from 'src/account/domain/entities/user';
import { IUserRepository } from 'src/account/domain/repository/user.repository.interface'; // Pastikan path yang benar

@Injectable()
export class UserRepository implements IUserRepository {
    private users: User[] = []; // Penyimpanan sementara pengguna

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email) || null;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.users.find(user => user.username === username) || null;
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(id: string, userData: User): Promise<User | null> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return null;

        const updatedUser = Object.assign(Object.create(Object.getPrototypeOf(this.users[userIndex])), this.users[userIndex], userData);
        this.users[userIndex] = updatedUser;
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        this.users = this.users.filter(user => user.id !== id);
    }
}
