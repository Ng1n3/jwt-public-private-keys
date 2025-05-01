
export interface IuserLoginDto {
  email: string;
  password: string;
}

export interface IuserRegisterUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserUpdateDto {
  name?: string;
  email?: string;
  password?: string;
}