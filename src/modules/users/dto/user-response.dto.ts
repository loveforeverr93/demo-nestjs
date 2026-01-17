export class UserReponseDto {
  userCode: string;
  username: string;
  email: string;
  fullName: string;
  role: string;

  constructor(partial: Partial<UserReponseDto>) {
    Object.assign(this, partial);
  }
}
