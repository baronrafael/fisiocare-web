import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { isValidEmail } from '../../../core/auth/auth-validation';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/ui/input-field/input-field.component';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';

@Component({
  selector: 'fc-register-page',
  imports: [FormsModule, ButtonComponent, InputFieldComponent, LinkButtonComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly hasRequiredFields = computed(() =>
    !!this.firstName().trim() &&
    !!this.lastName().trim() &&
    !!this.email().trim() &&
    !!this.password().trim() &&
    !!this.confirmPassword().trim()
  );
  protected readonly passwordsMismatch = computed(() =>
    this.confirmPassword().length > 0 && this.password() !== this.confirmPassword()
  );
  protected readonly isSubmitting = signal(false);
  protected readonly registerError = signal('');
  protected readonly canSubmit = computed(() =>
    this.hasRequiredFields() && !this.passwordsMismatch() && !this.isSubmitting()
  );

  protected onSubmit(): void {
    if (!this.hasRequiredFields()) {
      this.registerError.set('Completa todos los campos para continuar.');
      return;
    }

    if (!isValidEmail(this.email().trim())) {
      this.registerError.set('Ingresa un correo válido.');
      return;
    }

    if (this.passwordsMismatch() || this.isSubmitting()) {
      return;
    }

    this.registerError.set('');
    this.isSubmitting.set(true);

    this.authService
      .register(this.firstName().trim(), this.lastName().trim(), this.email().trim(), this.password())
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl('/app/patients');
        },
        error: (error: unknown) => {
          this.isSubmitting.set(false);
          if (error instanceof HttpErrorResponse && error.status === 400) {
            this.registerError.set(this.getRegisterErrorMessage(error.error));
            return;
          }

          this.registerError.set('No se pudo crear la cuenta en este momento.');
        }
      });
  }

  protected onEnterSubmit(event: Event): void {
    event.preventDefault();
    this.onSubmit();
  }

  private getRegisterErrorMessage(payload: unknown): string {
    if (!payload || typeof payload !== 'object') {
      return 'No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.';
    }

    const errorMap = payload as Record<string, unknown>;
    const emailMessage = this.firstError(errorMap['email']);
    if (emailMessage) {
      if (emailMessage.toLowerCase().includes('ya existe')) {
        return 'Ya existe una cuenta con este correo.';
      }

      return 'Revisa el correo ingresado.';
    }

    const passwordMessage = this.firstError(errorMap['password']);
    if (passwordMessage) {
      return 'Revisa la contraseña ingresada.';
    }

    const firstNameMessage = this.firstError(errorMap['first_name']);
    if (firstNameMessage) {
      return 'Revisa el nombre ingresado.';
    }

    const lastNameMessage = this.firstError(errorMap['last_name']);
    if (lastNameMessage) {
      return 'Revisa los apellidos ingresados.';
    }

    const nonFieldMessage = this.firstError(errorMap['detail']) || this.firstError(errorMap['non_field_errors']);
    if (nonFieldMessage) {
      return nonFieldMessage;
    }

    return 'No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.';
  }

  private firstError(value: unknown): string | null {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }

    if (typeof value === 'string') {
      return value;
    }

    return null;
  }
}
