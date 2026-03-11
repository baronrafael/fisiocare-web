export const TOAST_COPY = {
  session: {
    created: 'Sesion registrada correctamente.',
    updated: 'Sesion actualizada.'
  },
  patient: {
    created: 'Paciente creado correctamente.',
    updated: 'Paciente actualizado.',
    limitReached: 'Limite Free alcanzado. Activa Premium para agregar mas pacientes.'
  },
  plan: {
    freeLimit: 'Limite Free alcanzado. Actualiza a Premium para crear mas pacientes.',
    premiumOnly: 'Esta funcionalidad esta disponible en Premium.',
    upgraded: 'Plan Premium activado (mock).',
    downgraded: 'Volviste al plan Free (mock).'
  },
  auth: {
    logout: 'Sesion cerrada correctamente.'
  }
} as const;
