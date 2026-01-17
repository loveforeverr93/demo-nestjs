import { IsNotEmpty } from 'class-validator';
import { ProjectStatusEnum } from '../project.enum';

export class changeStatusProject {
  @IsNotEmpty()
  status: ProjectStatusEnum;
}
