export interface IRefreshTokenDTO {
  refreshToken: string;
}

export interface IAuthReponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}
