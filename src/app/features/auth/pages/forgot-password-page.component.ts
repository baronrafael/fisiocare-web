import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { isValidEmail } from '../../../core/auth/auth-validation';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/ui/input-field/input-field.component';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';

@Component({
  selector: 'fc-forgot-password-page',
  imports: [FormsModule, ButtonComponent, InputFieldComponent, LinkButtonComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly email = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly hasRequiredFields = computed(() => !!this.email().trim());
  protected readonly canSubmit = computed(() => this.hasRequiredFields() && !this.isSubmitting());

  protected onSubmit(): void {
    if (!this.hasRequiredFields()) {
      this.successMessage.set('');
      this.errorMessage.set('Completa tu correo para continuar.');
      return;
    }

    if (!isValidEmail(this.email().trim())) {
      this.successMessage.set('');
      this.errorMessage.set('Ingresa un correo válido.');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService.requestPasswordReset(this.email().trim()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Si el correo existe, te enviaremos un enlace para restablecer tu contraseña.');
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        if (error instanceof HttpErrorResponse && error.status === 400) {
          this.errorMessage.set('Revisa el correo ingresado e intenta nuevamente.');
          return;
        }

        this.errorMessage.set('No se pudo procesar la solicitud en este momento.');
      }
    });
  }
}
