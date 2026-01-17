export class UserProjectDto {
  userCode: string;
  username: string;
  fullName: string;
  email: string;

  constructor(partial: Partial<UserProjectDto>) {
    Object.assign(this, partial);
  }
}
