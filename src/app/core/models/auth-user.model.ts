export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  plan: 'free' | 'premium';
}
