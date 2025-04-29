import { Logger, Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { ROLE_REPOSITORY, ROLE_SERVICE, USER_REPOSITORY, USER_SERVICE } from '../common/constant';
import { UserRepository } from './infrastructure/presistence/user.repository';
import { User } from './domain/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/user.controller';
import { RoleController } from './presentation/role.controller';
import { RoleService } from './application/role.service';
import { RoleRepository } from './infrastructure/presistence/role.repository';
import { Role } from './domain/entities/role';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [UserController, RoleController],
    providers: [
        {
            provide: USER_SERVICE,
            useClass: UserService,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: ROLE_SERVICE,
            useClass: RoleService,
        },
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepository,
        },
    ],
})
export class AccountModule { }
