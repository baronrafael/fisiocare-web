import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ForgotPasswordPageComponent } from './forgot-password-page.component';

describe('ForgotPasswordPageComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [ForgotPasswordPageComponent],
      providers: [provideRouter([])]
    });
    const fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
