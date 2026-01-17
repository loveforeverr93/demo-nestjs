import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [TypeOrmModule.forFeature([User, Project])],
})
export class ProjectModule {}
