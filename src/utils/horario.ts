export function calcularProximaToma(hora: string, ahora: Date = new Date()): Date | null {
  const coincidencia = hora.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(hs|h)?$/i);
  if (!coincidencia) return null;

  const horas = parseInt(coincidencia[1], 10);
  const minutos = coincidencia[2] ? parseInt(coincidencia[2], 10) : 0;
  if (horas > 23 || minutos > 59) return null;

  const toma = new Date(ahora);
  toma.setHours(horas, minutos, 0, 0);

  if (toma.getTime() <= ahora.getTime()) {
    toma.setDate(toma.getDate() + 1);
  }
  return toma;
}

export function formatearHora(fecha: Date): string {
  const h = String(fecha.getHours()).padStart(2, '0');
  const m = String(fecha.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
