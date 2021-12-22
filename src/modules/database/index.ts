import { createConnection } from 'typeorm';
import { User, UserDeviceToken, Push, PushUser } from './entities';

export const initDatabase = () => createConnection({
    type: 'mysql',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [User, UserDeviceToken, Push, PushUser],
    synchronize: false,
    logging: false,
  });