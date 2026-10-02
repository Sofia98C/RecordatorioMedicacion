export type UnidadTiempo = 'segundos' | 'minutos' | 'horas';

// Pasa una cantidad en segundos, minutos u horas a segundos,
// que es lo que necesita el trigger de la notificación.
// Si la cantidad no es un número mayor a 0, devuelve 0.
export function convertirASegundos(cantidad: string, unidad: UnidadTiempo): number {
  const numero = parseInt(cantidad, 10);
  if (isNaN(numero) || numero <= 0) {
    return 0;
  }

  if (unidad === 'minutos') {
    return numero * 60;
  }
  if (unidad === 'horas') {
    return numero * 60 * 60;
  }
  return numero;
}
