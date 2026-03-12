import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
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
  protected readonly passwordsMismatch = computed(() =>
    this.confirmPassword().length > 0 && this.password() !== this.confirmPassword()
  );

  protected onSubmit(): void {
    if (this.passwordsMismatch()) {
      return;
    }

    const fullName = `${this.firstName().trim()} ${this.lastName().trim()}`.trim();
    this.authService.register(fullName || 'Profesional', this.email().trim());
    this.router.navigateByUrl('/app/patients');
  }
}
