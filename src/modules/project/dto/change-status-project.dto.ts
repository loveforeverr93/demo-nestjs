import { IsNotEmpty } from 'class-validator';
import { ProjectStatusEnum } from '../project.enum';

export class ChangeStatusProject {
  @IsNotEmpty({ message: 'Status is required' })
  status: ProjectStatusEnum;
}
