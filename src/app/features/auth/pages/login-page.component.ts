import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
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

  protected readonly email = signal('fisio@demo.com');
  protected readonly password = signal('');

  protected onSubmit(): void {
    this.authService.login(this.email());
    this.router.navigateByUrl('/app/patients');
  }
}
