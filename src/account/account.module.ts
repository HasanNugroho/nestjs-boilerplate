import { Logger, Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { USER_REPOSITORY, USER_SERVICE } from '../shared/constant';
import { UserRepository } from './infrastructure/orm/user.repository';
import { User } from './domain/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/user.controller';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [
        {
            provide: USER_SERVICE,
            useClass: UserService,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
    ],
})
export class AccountModule { }
