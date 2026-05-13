import 'dotenv/config';
import { DataSource } from 'typeorm';
import { HeyamaObject } from './objects/object.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'heyama',
  synchronize: false, // keep false when using migrations
  logging: false,
  entities: [HeyamaObject],
  migrations: ['src/migrations/*.ts'],
});

export default AppDataSource;
