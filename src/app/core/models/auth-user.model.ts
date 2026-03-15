export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  // TODO(backend): include plan in /users/me response to replace frontend fallback.
  plan: 'free' | 'pro';
}
