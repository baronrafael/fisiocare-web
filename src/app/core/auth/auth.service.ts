import { computed, Injectable, signal } from '@angular/core';
import { AuthUser } from '../models/auth-user.model';

const STORAGE_KEY = 'fc_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<AuthUser | null>(this.restoreUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  login(email: string): void {
    const user: AuthUser = {
      id: 'u-001',
      fullName: 'Fisio Demo',
      email,
      plan: 'free'
    };

    this.userSignal.set(user);
    this.persistUser(user);
  }

  register(fullName: string, email: string): void {
    const user: AuthUser = {
      id: 'u-001',
      fullName,
      email,
      plan: 'free'
    };

    this.userSignal.set(user);
    this.persistUser(user);
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  setPlan(plan: 'free' | 'premium'): void {
    const currentUser = this.userSignal();
    if (!currentUser) {
      return;
    }

    const updatedUser: AuthUser = {
      ...currentUser,
      plan
    };

    this.userSignal.set(updatedUser);
    this.persistUser(updatedUser);
  }

  private restoreUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private persistUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}
