import { HttpClient } from '@angular/common/http';
import { computed, Injectable, inject, signal } from '@angular/core';
import { map, Observable, switchMap, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthUser } from '../models/auth-user.model';

const USER_STORAGE_KEY = 'fc_auth_user';
const ACCESS_TOKEN_STORAGE_KEY = 'fc_auth_access';
const REFRESH_TOKEN_STORAGE_KEY = 'fc_auth_refresh';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface ApiUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userSignal = signal<AuthUser | null>(this.restoreUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    const hasStoredUser = !!this.userSignal();
    const hasAccessToken = !!this.getAccessToken();
    if (!hasStoredUser && hasAccessToken) {
      this.fetchCurrentUser().subscribe({
        error: () => this.clearSession()
      });
    }
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login/`, {
        email,
        password
      })
      .pipe(
        tap((tokens) => this.persistTokens(tokens.access, tokens.refresh)),
        switchMap(() => this.fetchCurrentUser())
      );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<AuthUser> {
    return this.http
      .post(`${API_BASE_URL}/auth/register/`, {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })
      .pipe(switchMap(() => this.login(email, password)));
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post(`${API_BASE_URL}/auth/password-reset/`, { email }).pipe(map(() => void 0));
  }

  logout(): void {
    this.clearSession();
  }

  setPlan(plan: 'free' | 'pro'): void {
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

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{ access: string }>(`${API_BASE_URL}/auth/token/refresh/`, { refresh: refreshToken })
      .pipe(
        map((response) => response.access),
        tap((access) => localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access))
      );
  }

  private fetchCurrentUser(): Observable<AuthUser> {
    return this.http.get<ApiUser>(`${API_BASE_URL}/users/me/`).pipe(
      map((apiUser) => this.mapApiUserToAuthUser(apiUser)),
      tap((user) => {
        this.userSignal.set(user);
        this.persistUser(user);
      })
    );
  }

  private restoreUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      const parsed = raw
        ? (JSON.parse(raw) as {
            id?: unknown;
            fullName?: unknown;
            email?: unknown;
            plan?: unknown;
          })
        : null;

      if (
        !parsed ||
        typeof parsed.id !== 'string' ||
        typeof parsed.fullName !== 'string' ||
        typeof parsed.email !== 'string' ||
        typeof parsed.plan !== 'string'
      ) {
        return null;
      }

      const normalizedPlan: AuthUser['plan'] = parsed.plan === 'premium' || parsed.plan === 'pro' ? 'pro' : 'free';

      return {
        id: parsed.id,
        fullName: parsed.fullName,
        email: parsed.email,
        plan: normalizedPlan
      };
    } catch {
      return null;
    }
  }

  private persistUser(user: AuthUser): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  private persistTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh);
  }

  private clearSession(): void {
    this.userSignal.set(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  private mapApiUserToAuthUser(apiUser: ApiUser): AuthUser {
    const firstName = (apiUser.first_name ?? '').trim();
    const lastName = (apiUser.last_name ?? '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || apiUser.email;

    return {
      id: String(apiUser.id),
      fullName,
      email: apiUser.email,
      plan: this.userSignal()?.plan ?? 'free'
    };
  }
}
