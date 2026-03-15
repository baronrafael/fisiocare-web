export type PatientStatus = 'active' | 'paused' | 'discharged';
export type CareMode = 'home' | 'clinic';

export interface PatientCompanion {
  present: boolean;
  description?: string;
}

export interface PatientPets {
  present: boolean;
  description?: string;
}

export interface PatientIntakeChecklist {
  addressConfirmed?: boolean;
  adequateSpace?: boolean;
  companionPresent?: boolean;
  petsPresent?: boolean;
  studiesLoaded?: boolean;
  specialHomeConditions?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  primaryPhone?: string;
  secondaryPhone?: string;
  address?: string;
  reference?: string;
  careMode: CareMode;
  status: PatientStatus;
  diagnosis: string;
  initialClinicalNotes?: string;
  // TODO(backend): expose studies notes in patients API.
  studiesNotes?: string;
  consentGiven?: boolean;
  companion?: PatientCompanion;
  pets?: PatientPets;
  availableSpace?: string;
  // TODO(backend): expose contextual notes in patients API.
  contextualNotes?: string;
  paymentMode?: 'per-session' | 'weekly' | 'biweekly' | 'insurance';
  paymentNotes?: string;
  persistentNotes?: string;
  // TODO(backend): expose intake checklist fields and persist them.
  intakeChecklist?: PatientIntakeChecklist;
  // TODO(backend): expose last session date/summary for patient listing/detail.
  lastSessionAt: string;
}
