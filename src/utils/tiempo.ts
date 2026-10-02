export type UnidadTiempo = 'segundos' | 'minutos' | 'horas';

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
