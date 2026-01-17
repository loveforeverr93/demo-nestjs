import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Project } from '../../modules/project/entities/project.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.MYSQL_URL,
  entities: [User, Project],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});
