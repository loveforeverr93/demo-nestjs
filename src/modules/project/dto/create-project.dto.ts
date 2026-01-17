import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserProjectDto } from './user-project.dto';
import { ProjectPriorityEnum } from '../project.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  members: UserProjectDto[];

  @IsString()
  @IsOptional()
  priority: ProjectPriorityEnum;
}
