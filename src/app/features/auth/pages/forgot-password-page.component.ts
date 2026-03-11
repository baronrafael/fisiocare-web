import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'fc-forgot-password-page',
  imports: [RouterLink],
  template: `
    <main class="mx-auto flex min-h-dvh max-w-md items-center px-4 py-8">
      <section class="fc-card w-full p-6">
        <h1 class="text-2xl font-semibold">Recuperar contrasena</h1>
        <p class="mt-2 text-sm text-slate-600">
          Este flujo estara conectado al backend en la siguiente fase. Por ahora es una vista de referencia.
        </p>

        <label class="mt-6 block text-sm font-medium text-slate-700">
          Correo
          <input class="fc-input mt-1" type="email" placeholder="tu-correo@dominio.com" />
        </label>

        <button class="fc-btn fc-btn-primary mt-4 w-full" type="button">Enviar enlace</button>

        <a routerLink="/auth/login" class="mt-4 inline-block text-sm text-teal-700 hover:underline">Volver al login</a>
      </section>
    </main>
  `
})
export class ForgotPasswordPageComponent {}
