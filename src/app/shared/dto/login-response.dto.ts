export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    role: 'ADMIN' | 'SuperAdmin';
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string | null;
  };
}