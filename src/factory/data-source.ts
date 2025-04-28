import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
        __dirname + '/../**/entities/*{.ts,.js}'
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === 'production' ? false : true,
    migrations: [
        path.join(__dirname, process.env.NODE_ENV === 'production' ? '../dist/migrations/*.js' : '../**/migrations/*.ts')
    ],
})

export default AppDataSource;