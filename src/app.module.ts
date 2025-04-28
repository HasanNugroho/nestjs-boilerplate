import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './factory/configuration';
import { AppDataSource } from './factory/data-source';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development.local', '.env.development'],
            load: [configuration],
        }),
        TypeOrmModule.forRoot(AppDataSource.options),
        AccountModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
