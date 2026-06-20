export interface User {
  id: number;
  name: string;
  lastName: string,
  middleName?: string;
  email: string;
  role: string;
  isBanned: boolean;
}
