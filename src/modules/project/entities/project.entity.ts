import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectPriorityEnum, ProjectStatusEnum } from '../project.enum';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'project_code', type: 'varchar', unique: true })
  projectCode: string;

  @Column({ name: 'project_name', type: 'varchar', length: '100' })
  projectName: string;

  @ManyToOne(() => User, (user) => user.ownedProjects, { eager: true })
  owner: User;

  @ManyToMany(() => User, (user) => user.memberProjects, { eager: true })
  @JoinTable({
    name: 'projects_members_users',
  })
  members: User[];

  @Column({
    name: 'project_status',
    type: 'enum',
    enum: ProjectStatusEnum,
    default: ProjectStatusEnum.PLANNING,
  })
  status: ProjectStatusEnum;

  @Column({
    name: 'project_priority',
    type: 'enum',
    enum: ProjectPriorityEnum,
    default: ProjectPriorityEnum.LOW,
  })
  priority: ProjectPriorityEnum;

  @Column({ name: 'project_description', type: 'varchar', length: '255' })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt?: Date;
}
