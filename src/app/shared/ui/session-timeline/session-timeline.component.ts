import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { SessionRecord } from '../../../core/models/session.model';

@Component({
  selector: 'fc-session-timeline',
  imports: [CommonModule],
  templateUrl: './session-timeline.component.html',
  styleUrl: './session-timeline.component.scss'
})
export class SessionTimelineComponent {
  readonly sessions = input.required<SessionRecord[]>();

  protected sessionTypeLabel(type: SessionRecord['type']): string {
    switch (type) {
      case 'physical':
        return 'Fisica';
      case 'cognitive':
        return 'Cognitiva';
      default:
        return 'Mixta';
    }
  }

  protected totalMinutes(session: SessionRecord): number {
    return session.activities.reduce((total, activity) => total + (activity.durationMinutes ?? 0), 0);
  }
}
