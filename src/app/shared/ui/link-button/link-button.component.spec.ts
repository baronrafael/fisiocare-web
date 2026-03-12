import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LinkButtonComponent } from './link-button.component';

describe('LinkButtonComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [LinkButtonComponent],
      providers: [provideRouter([])]
    });

    const fixture = TestBed.createComponent(LinkButtonComponent);
    fixture.componentRef.setInput('routerLink', '/auth/login');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
