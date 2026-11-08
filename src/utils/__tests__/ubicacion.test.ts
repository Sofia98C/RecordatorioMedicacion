import { formatearDireccion, formatearCoordenadas, linkMapa } from '../ubicacion';

describe('formatearDireccion', () => {
  it('arma calle, número y ciudad', () => {
    const d = { street: 'Av. Mate de Luna', streetNumber: '1234', city: 'San Miguel de Tucumán' };
    expect(formatearDireccion(d)).toBe('Av. Mate de Luna 1234, San Miguel de Tucumán');
  });

  it('usa la provincia si no hay ciudad', () => {
    expect(formatearDireccion({ street: 'Córdoba', region: 'Tucumán' })).toBe('Córdoba, Tucumán');
  });

  it('devuelve un texto por defecto si no hay datos', () => {
    expect(formatearDireccion(undefined)).toBe('Dirección desconocida');
    expect(formatearDireccion({})).toBe('Dirección desconocida');
  });
});

describe('coordenadas y mapa', () => {
  it('muestra las coordenadas con 4 decimales', () => {
    expect(formatearCoordenadas(-26.824123, -65.222678)).toBe('-26.8241, -65.2227');
  });

  it('arma el link de Google Maps', () => {
    expect(linkMapa(-26.8, -65.2)).toBe(
      'https://www.google.com/maps/search/?api=1&query=-26.8,-65.2'
    );
  });
});
