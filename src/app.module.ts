import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import * as path from 'path';
import * as glob from 'glob';

// Helper function to load entities dynamically based on environment
const getEntities = (env: string | undefined) => {
  const globPattern = path.join(__dirname, '**/entities/*.' + (env === 'production' ? 'js' : 'ts'));
  return glob.sync(globPattern);
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: getEntities(process.env.NODE_ENV),
      synchronize: true,
      logging: true,
    }),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
