import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserProjectDto } from './user-project.dto';
import { ProjectPriorityEnum } from '../project.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  @MinLength(6, { message: 'Project name must be at least 6 characters' })
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
