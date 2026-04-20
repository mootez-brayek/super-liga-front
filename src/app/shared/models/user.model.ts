export interface User {
  id: number;
  email: string;
  role: 'Admin' | 'SuperAdmin';
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber?: string;
  active: boolean;
}