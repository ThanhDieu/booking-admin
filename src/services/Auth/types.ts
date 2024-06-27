export interface LoginPayload {
  username: string;
  password: string;
}

export interface RenewPayload {
  refreshToken: string;
}

export interface LoginResponse extends RenewPayload {
  token: string;
}

export interface LoginResponseQuery {
  userLogin: LoginResponse;
}

export interface ResponseNewToken {
  token: string;
}
