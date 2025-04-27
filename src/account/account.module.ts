import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { USER_REPOSITORY, USER_SERVICE } from '../shared/constant';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  controllers: [],
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
