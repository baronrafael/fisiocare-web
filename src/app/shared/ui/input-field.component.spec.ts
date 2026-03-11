import { TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [InputFieldComponent] });
    const fixture = TestBed.createComponent(InputFieldComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
