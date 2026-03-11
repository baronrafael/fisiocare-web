import { TestBed } from '@angular/core/testing';
import { CheckboxFieldComponent } from './checkbox-field.component';

describe('CheckboxFieldComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [CheckboxFieldComponent] });
    const fixture = TestBed.createComponent(CheckboxFieldComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
