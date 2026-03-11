import { TestBed } from '@angular/core/testing';
import { ToastStackComponent } from './toast-stack.component';

describe('ToastStackComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [ToastStackComponent] });
    const fixture = TestBed.createComponent(ToastStackComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
