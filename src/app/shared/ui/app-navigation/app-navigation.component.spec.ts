import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppNavigationComponent } from './app-navigation.component';

describe('AppNavigationComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [AppNavigationComponent],
      providers: [provideRouter([])]
    });
    const fixture = TestBed.createComponent(AppNavigationComponent);
    fixture.componentRef.setInput('navItems', [
      { label: 'Pacientes', path: '/app/patients', icon: 'patients' },
      { label: 'Dashboard', path: '/app/dashboard', icon: 'dashboard' }
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
