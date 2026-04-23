export interface JwtPayload {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  username: string;
  date_joined: string;
  isActived: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isNewUser: boolean;
  company: string;
  modules: any[];
  roles: any[];
  permissions: any[];
  iat: number;
  exp: number;
}
