import { TestBed } from '@angular/core/testing';
import { GlobalHeaderComponent } from './global-header.component';

describe('GlobalHeaderComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [GlobalHeaderComponent] });
    const fixture = TestBed.createComponent(GlobalHeaderComponent);
    fixture.componentRef.setInput('userName', 'Fisio');
    fixture.componentRef.setInput('patientLimitReached', false);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
