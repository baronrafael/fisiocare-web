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
  studiesNotes?: string;
  consentGiven?: boolean;
  companion?: PatientCompanion;
  pets?: PatientPets;
  availableSpace?: string;
  contextualNotes?: string;
  paymentMode?: 'per-session' | 'weekly' | 'biweekly' | 'insurance';
  paymentNotes?: string;
  persistentNotes?: string;
  intakeChecklist?: PatientIntakeChecklist;
  lastSessionAt: string;
}
