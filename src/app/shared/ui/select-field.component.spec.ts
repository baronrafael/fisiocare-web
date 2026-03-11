import { TestBed } from '@angular/core/testing';
import { SelectFieldComponent } from './select-field.component';

describe('SelectFieldComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [SelectFieldComponent] });
    const fixture = TestBed.createComponent(SelectFieldComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
