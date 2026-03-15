import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { isValidEmail } from '../../../core/auth/auth-validation';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/ui/input-field/input-field.component';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';

@Component({
  selector: 'fc-login-page',
  imports: [FormsModule, ButtonComponent, InputFieldComponent, LinkButtonComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly authError = signal('');

  protected onSubmit(): void {
    const email = this.email().trim();
    const password = this.password().trim();

    if (!email || !password) {
      this.authError.set('Completa correo y contraseña para continuar.');
      return;
    }

    if (!isValidEmail(email)) {
      this.authError.set('Ingresa un correo válido.');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.authError.set('');
    this.isSubmitting.set(true);

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/app/patients');
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authError.set('Correo o contraseña incorrectos.');
          return;
        }

        this.authError.set('No se pudo iniciar sesión. Intenta nuevamente.');
      }
    });
  }
}
