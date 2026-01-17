import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class UpdateProjectMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMembersDto)
  members: ProjectMembersDto[];
}

export class ProjectMembersDto {
  @IsString()
  userCode: string;

  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;
}
