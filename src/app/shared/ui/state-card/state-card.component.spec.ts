import { TestBed } from '@angular/core/testing';
import { StateCardComponent } from './state-card.component';

describe('StateCardComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [StateCardComponent] });
    const fixture = TestBed.createComponent(StateCardComponent);
    fixture.componentRef.setInput('title', 'Titulo');
    fixture.componentRef.setInput('message', 'Mensaje');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
