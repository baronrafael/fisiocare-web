export const TOAST_COPY = {
  session: {
    created: 'Sesion registrada correctamente.',
    updated: 'Sesion actualizada.'
  },
  patient: {
    created: 'Paciente creado correctamente.',
    updated: 'Paciente actualizado.',
    deleted: 'Paciente eliminado.',
    deleteError: 'No se pudo eliminar el paciente.',
    limitReached: 'Limite Free alcanzado. Activa Pro para agregar mas pacientes.'
  },
  plan: {
    freeLimit: 'Limite Free alcanzado. Actualiza a Pro para crear mas pacientes.',
    proOnly: 'Esta funcionalidad esta disponible en Pro.',
    upgraded: 'Plan Pro activado (mock).',
    downgraded: 'Volviste al plan Free (mock).'
  },
  auth: {
    logout: 'Sesion cerrada correctamente.'
  }
} as const;
