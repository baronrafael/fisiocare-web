import { SessionActivity, SessionType } from './session.model';

export interface SessionTemplate {
  id: string;
  name: string;
  defaultSessionType: SessionType;
  notesStructure?: string;
  suggestedActivities: Array<Pick<SessionActivity, 'name' | 'type' | 'sets' | 'reps' | 'description'>>;
  includeBorg?: boolean;
  includeWongBaker?: boolean;
  includeVitals?: boolean;
}
