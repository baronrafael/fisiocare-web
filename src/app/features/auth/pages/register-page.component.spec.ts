import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterPageComponent } from './register-page.component';

describe('RegisterPageComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [provideRouter([])]
    });
    const fixture = TestBed.createComponent(RegisterPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
