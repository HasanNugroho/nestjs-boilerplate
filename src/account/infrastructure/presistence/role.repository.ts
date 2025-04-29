import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, In, Repository } from "typeorm";
import { IRoleRepository } from "src/account/domain/repository/role.repository.interface";
import { Role } from "src/account/domain/entities/role";
import { BaseQueryDto } from "src/common/dto/filter.dto";

@Injectable()
export class RoleRepository implements IRoleRepository {
    constructor(
        @InjectRepository(Role)
        private readonly db: Repository<Role>,
    ) { }

    async create(role: Role): Promise<Role> {
        try {
            return await this.db.save(role);
        } catch (error) {
            throw new InternalServerErrorException('Database error on role creation');
        }
    }

    async findById(id: string): Promise<Role | null> {
        return this.db.findOne({ where: { id } });
    }

    async findAll(filter: BaseQueryDto): Promise<{ roles: Role[]; totalCount: number; }> {
        const where: FindOptionsWhere<Role> = {};
        const offset = (filter.page - 1) * filter.limit;

        if (filter.keyword) {
            where.name = ILike(`%${filter.keyword}%`);
        }

        const [roles, totalCount] = await this.db.findAndCount({
            where,
            order: {
                [filter.sortBy || 'created_at']: filter.sortOrder || 'DESC',
            },
            skip: offset,
            take: filter.limit,
        });

        return { roles, totalCount };
    }

    async findManyById(ids: string[]): Promise<Role[] | null> {
        return this.db.findBy({
            id: In(ids)
        })
    }

    async update(id: string, RoleData: Partial<Role>): Promise<void> {
        const existingRole = await this.db.findOne({ where: { id } });

        if (!existingRole) {
            throw new NotFoundException('Role not found');
        }

        Object.assign(existingRole, RoleData);
        try {
            this.db.save(existingRole);
        } catch (error) {
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(id);
    }
}
