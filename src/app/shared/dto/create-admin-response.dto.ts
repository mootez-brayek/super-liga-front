export interface CreateAdminResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  active: boolean;
  role: 'Admin';
}