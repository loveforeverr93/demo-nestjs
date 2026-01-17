import { UserProjectDto } from './user-project.dto';

export class ProjectResponseDto {
  projectCode: string;
  projectName: string;
  description: string;
  status: string;
  priority: string;
  owner: UserProjectDto;
  members: UserProjectDto[];
  createdAt: Date;

  constructor(partial: Partial<ProjectResponseDto>) {
    Object.assign(this, partial);
  }
}
