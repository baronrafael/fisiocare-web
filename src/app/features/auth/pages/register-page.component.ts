import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'fc-register-page',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="mx-auto flex min-h-dvh max-w-md items-center px-4 py-8">
      <section class="fc-card w-full p-6">
        <h1 class="text-2xl font-semibold">Crear cuenta</h1>
        <p class="mt-2 text-sm text-slate-600">Comienza a organizar tu seguimiento clinico en minutos.</p>

        <form class="mt-6 space-y-4" (ngSubmit)="onSubmit()">
          <label class="block text-sm font-medium text-slate-700">
            Nombre completo
            <input class="fc-input mt-1" type="text" name="fullName" [value]="fullName()" (input)="onNameChange($event)" required />
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Correo
            <input class="fc-input mt-1" type="email" name="email" [value]="email()" (input)="onEmailChange($event)" required />
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Contrasena
            <input class="fc-input mt-1" type="password" name="password" [value]="password()" (input)="onPasswordChange($event)" required />
          </label>

          <button type="submit" class="fc-btn fc-btn-primary w-full">Crear y entrar</button>
        </form>

        <p class="mt-5 text-sm text-slate-600">
          Ya tienes cuenta?
          <a routerLink="/auth/login" class="text-teal-700 hover:underline">Inicia sesion</a>
        </p>
      </section>
    </main>
  `
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly fullName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');

  protected onNameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fullName.set(input.value);
  }

  protected onEmailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  protected onPasswordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  protected onSubmit(): void {
    this.authService.register(this.fullName(), this.email());
    this.router.navigateByUrl('/app/patients');
  }
}
