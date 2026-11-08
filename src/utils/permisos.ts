export type EstadoPermiso = 'concedido' | 'denegado' | 'pendiente';

export type Recurso = 'camara' | 'galeria' | 'ubicacion' | 'contactos' | 'calendario';

export function mapearEstado(status: string | undefined | null): EstadoPermiso {
  if (status === 'granted') return 'concedido';
  if (status === 'denied') return 'denegado';
  return 'pendiente';
}

export const NOMBRES_RECURSO: Record<Recurso, string> = {
  camara: 'Cámara',
  galeria: 'Galería',
  ubicacion: 'Ubicación',
  contactos: 'Contactos',
  calendario: 'Calendario',
};

export const MOTIVO_RECURSO: Record<Recurso, string> = {
  camara: 'Sin la cámara no podés sacarle foto al medicamento. Podés elegir una foto de la galería.',
  galeria: 'Sin acceso a la galería no podés elegir una foto. Podés sacarla con la cámara.',
  ubicacion: 'Sin la ubicación no podemos registrar la farmacia automáticamente. Podés escribir la dirección a mano.',
  contactos: 'Sin acceso a tus contactos no podés elegir al médico o familiar. Podés cargarlo a mano.',
  calendario: 'Sin acceso al calendario no podemos agendar la toma. Igual vas a recibir la notificación de la app.',
};
