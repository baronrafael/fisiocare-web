import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'fc-login-page',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="mx-auto flex min-h-dvh max-w-md items-center px-4 py-8">
      <section class="fc-card w-full p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">FisioCare</p>
        <h1 class="mt-2 text-2xl font-semibold">Iniciar sesion</h1>
        <p class="mt-2 text-sm text-slate-600">Accede a tu practica clinica desde cualquier lugar.</p>

        <form class="mt-6 space-y-4" (ngSubmit)="onSubmit()">
          <label class="block text-sm font-medium text-slate-700">
            Correo
            <input class="fc-input mt-1" type="email" name="email" [value]="email()" (input)="onEmailChange($event)" required />
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Contrasena
            <input class="fc-input mt-1" type="password" name="password" [value]="password()" (input)="onPasswordChange($event)" required />
          </label>

          <button type="submit" class="fc-btn fc-btn-primary w-full">Entrar</button>
        </form>

        <div class="mt-5 flex items-center justify-between text-sm">
          <a routerLink="/auth/forgot-password" class="text-teal-700 hover:underline">Recuperar contrasena</a>
          <a routerLink="/auth/register" class="text-slate-700 hover:underline">Crear cuenta</a>
        </div>
      </section>
    </main>
  `
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('fisio@demo.com');
  protected readonly password = signal('');

  protected onEmailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  protected onPasswordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  protected onSubmit(): void {
    this.authService.login(this.email());
    this.router.navigateByUrl('/app/patients');
  }
}
