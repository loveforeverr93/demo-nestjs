import { IsNotEmpty } from 'class-validator';
import { ProjectStatusEnum } from '../project.enum';

export class changeStatusProject {
  @IsNotEmpty({ message: 'Status is required' })
  status: ProjectStatusEnum;
}
