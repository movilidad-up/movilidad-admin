import { getFirestoreErrorDetails } from '../domain/utils/firestoreError';

export function FirestoreErrorNotice({ error, title = 'No se pudieron cargar los datos' }: { error: unknown; title?: string }) {
  const details = getFirestoreErrorDetails(error);
  return (
    <div className="error-banner" role="alert">
      <strong>{title}</strong>
      <span>{details.message}</span>
      {details.indexUrl && <a href={details.indexUrl} target="_blank" rel="noreferrer">Abrir configuración del índice</a>}
      <small>Código de error: {details.code}</small>
    </div>
  );
}
