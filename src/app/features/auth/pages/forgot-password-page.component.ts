import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/ui/input-field/input-field.component';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';

@Component({
  selector: 'fc-forgot-password-page',
  imports: [ButtonComponent, InputFieldComponent, LinkButtonComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordPageComponent {}
