import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/account/domain/entities/user";
import { IUserRepository } from "src/account/domain/repository/user.repository.interface";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly db: Repository<User>,
    ) { }

    async create(user: User): Promise<User> {
        return this.db.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.db.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.db.findOne({ where: { email } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.db.findOne({ where: { username } });
    }

    async update(id: string, userData: Partial<User>): Promise<User> {
        const existingUser = await this.db.findOne({ where: { id } });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        Object.assign(existingUser, userData);
        return this.db.save(existingUser);
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(id);
    }
}
