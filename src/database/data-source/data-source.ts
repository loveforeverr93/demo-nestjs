import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Project } from '../../modules/project/entities/project.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Project],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});
