export type SessionType = 'physical' | 'cognitive' | 'mixed';
export type ActivityType = 'physical' | 'cognitive';

export interface SessionActivity {
  id: string;
  name: string;
  type: ActivityType;
  sets?: number;
  reps?: number;
  durationMinutes?: number;
  description?: string;
}

export interface SessionVitals {
  pa?: string;
  fc?: number;
  spo2?: number;
}

export interface SessionEvaluations {
  rpe?: number;
  rir?: number;
  rm?: number;
}

export interface SessionRecord {
  id: string;
  patientId: string;
  sessionAt: string;
  type: SessionType;
  generalNotes?: string;
  activities: SessionActivity[];
  borgScale?: number;
  wongBakerScale?: number;
  preEffort?: SessionVitals;
  postEffort?: SessionVitals;
  evaluations?: SessionEvaluations;
}
