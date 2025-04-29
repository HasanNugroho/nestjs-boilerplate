import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    fullname: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column('text')
    chiperText: string;

    @Column({ type: 'uuid', default: null, nullable: true })
    role_id: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    new(name: string, fullname: string, username: string, email: string, password: string) {
        this.name = name;
        this.fullname = fullname;
        this.username = username;
        this.email = email;
        this.chiperText = password;

        return this;
    }

    async encryptPassword(password: string): Promise<void> {
        const saltOrRounds = 10;
        this.chiperText = await bcrypt.hash(password, saltOrRounds);
    }

    validatePasswordHash(password: string): boolean {
        return bcrypt.compare(password, this.chiperText);
    }

    toResponseObject() {
        const { chiperText, ...userData } = this;
        return userData;
    }
}
