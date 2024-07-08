export interface User {
  id: number;
  email: string;
  userName: string;
  password: string;
  image: string;
  Status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface jwtPayLoad {
  email: string,
  userName: string,
  image : string
}