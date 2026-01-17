import { IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  description: string;
}
