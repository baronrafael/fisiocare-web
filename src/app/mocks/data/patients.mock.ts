import { Patient } from '../../core/models/patient.model';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p-001',
    fullName: 'Rosa Quintero',
    age: 74,
    primaryPhone: '+57 300 111 2233',
    secondaryPhone: '+57 300 999 8811',
    address: 'Calle 49 #18-22, Medellin',
    reference: 'Edificio verde, piso 3',
    careMode: 'home',
    status: 'active',
    diagnosis: 'Rehabilitacion post fractura de cadera',
    initialClinicalNotes: 'Fatiga rapida en cambios de posicion. Requiere apoyo parcial.',
    studiesNotes: 'Rx de control de febrero sin complicaciones.',
    consentGiven: true,
    companion: { present: true, description: 'Hija presente en la mayoria de sesiones.' },
    pets: { present: false },
    availableSpace: 'Sala con pasillo despejado.',
    contextualNotes: 'Prefiere sesiones cortas en la manana.',
    paymentMode: 'weekly',
    paymentNotes: 'Transferencia cada viernes.',
    persistentNotes: 'Evitar esfuerzos sostenidos > 8 min sin pausa.',
    intakeChecklist: {
      addressConfirmed: true,
      adequateSpace: true,
      companionPresent: true,
      petsPresent: false,
      studiesLoaded: true,
      specialHomeConditions: 'Ascensor pequeno y pasillo angosto en entrada.'
    },
    lastSessionAt: '2026-03-09'
  },
  {
    id: 'p-002',
    fullName: 'Julio Arce',
    age: 66,
    primaryPhone: '+57 301 456 1200',
    address: 'Cra 70 #12-40, Medellin',
    careMode: 'clinic',
    status: 'active',
    diagnosis: 'Lumbalgia cronica',
    initialClinicalNotes: 'Dolor lumbar mecanico con irradiacion ocasional.',
    consentGiven: true,
    companion: { present: false },
    pets: { present: false },
    paymentMode: 'per-session',
    persistentNotes: 'Buena adherencia a ejercicios domiciliarios.',
    intakeChecklist: {
      addressConfirmed: true,
      adequateSpace: true,
      companionPresent: false,
      petsPresent: false,
      studiesLoaded: false
    },
    lastSessionAt: '2026-03-10'
  },
  {
    id: 'p-003',
    fullName: 'Marta Hidalgo',
    age: 81,
    careMode: 'home',
    status: 'paused',
    diagnosis: 'Deterioro funcional por desuso',
    lastSessionAt: '2026-02-18'
  },
  {
    id: 'p-004',
    fullName: 'Kevin Suarez',
    age: 49,
    careMode: 'clinic',
    status: 'discharged',
    diagnosis: 'Rehabilitacion de hombro',
    lastSessionAt: '2026-02-27'
  }
];
