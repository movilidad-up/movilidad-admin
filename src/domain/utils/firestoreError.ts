export interface FirestoreErrorDetails {
  code: string;
  message: string;
  indexUrl?: string;
}

export function getFirestoreErrorDetails(error: unknown): FirestoreErrorDetails {
  const firebaseError = error as { code?: unknown; message?: unknown } | null;
  const code = typeof firebaseError?.code === 'string' ? firebaseError.code : 'unknown';
  const rawMessage = typeof firebaseError?.message === 'string' ? firebaseError.message : '';
  const indexUrl = rawMessage.match(/https:\/\/console\.firebase\.google\.com\/[^\s)]+/)?.[0].replace(/[.,]+$/, '');

  let message = 'Ocurrió un error inesperado al consultar Firestore.';
  switch (code) {
    case 'permission-denied':
      message = 'Firestore rechazó la lectura. Comprueba las reglas del grupo records y que la sesión tenga el custom claim admin: true.';
      break;
    case 'failed-precondition':
      message = 'Firestore no puede ejecutar la consulta con la configuración actual. Revisa el índice requerido y que tenga alcance de grupo de colecciones.';
      break;
    case 'unauthenticated':
      message = 'La sesión no está autenticada. Cierra sesión y vuelve a ingresar al panel.';
      break;
    case 'unavailable':
      message = 'Firestore no está disponible. Revisa la conexión e inténtalo de nuevo.';
      break;
    default:
      if (code !== 'unknown') message = 'No se pudo completar la consulta de Firestore.';
  }

  return { code, message, indexUrl };
}
