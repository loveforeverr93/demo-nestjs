import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { RoleEnum } from '../../../common/constants/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'user_code', type: 'varchar', unique: true, nullable: true })
  userCode: string;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({
    name: 'user_role',
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  memberProjects: Project[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
