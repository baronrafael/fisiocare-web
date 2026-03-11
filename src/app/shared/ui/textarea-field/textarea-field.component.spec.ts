import { TestBed } from '@angular/core/testing';
import { TextareaFieldComponent } from './textarea-field.component';

describe('TextareaFieldComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [TextareaFieldComponent] });
    const fixture = TestBed.createComponent(TextareaFieldComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
