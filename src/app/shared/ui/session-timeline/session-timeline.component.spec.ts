import { TestBed } from '@angular/core/testing';
import { SessionTimelineComponent } from './session-timeline.component';

describe('SessionTimelineComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [SessionTimelineComponent] });
    const fixture = TestBed.createComponent(SessionTimelineComponent);
    fixture.componentRef.setInput('sessions', []);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
