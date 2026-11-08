import { mapearEstado } from '../permisos';

describe('mapearEstado', () => {
  it('granted es concedido', () => {
    expect(mapearEstado('granted')).toBe('concedido');
  });

  it('denied es denegado', () => {
    expect(mapearEstado('denied')).toBe('denegado');
  });

  it('undetermined (o sin dato) es pendiente', () => {
    expect(mapearEstado('undetermined')).toBe('pendiente');
    expect(mapearEstado(undefined)).toBe('pendiente');
  });
});
