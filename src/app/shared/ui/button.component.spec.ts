import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [ButtonComponent] });
    const fixture = TestBed.createComponent(ButtonComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
