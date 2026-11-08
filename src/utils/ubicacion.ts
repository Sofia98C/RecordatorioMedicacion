type DireccionGeocodificada = {
  street?: string | null;
  streetNumber?: string | null;
  name?: string | null;
  city?: string | null;
  region?: string | null;
};

export function formatearDireccion(d: DireccionGeocodificada | undefined | null): string {
  if (!d) return 'Dirección desconocida';

  const calle = d.street ? [d.street, d.streetNumber].filter(Boolean).join(' ') : d.name ?? '';
  const partes = [calle, d.city ?? d.region].filter((p) => p && p.trim() !== '');

  return partes.length > 0 ? partes.join(', ') : 'Dirección desconocida';
}

export function formatearCoordenadas(latitud: number, longitud: number): string {
  return `${latitud.toFixed(4)}, ${longitud.toFixed(4)}`;
}

export function linkMapa(latitud: number, longitud: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
}
