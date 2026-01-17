import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  email: string;
}
