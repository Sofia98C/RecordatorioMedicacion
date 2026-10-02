import { convertirASegundos } from '../tiempo';

describe('convertirASegundos', () => {
  it('deja igual los segundos', () => {
    expect(convertirASegundos('30', 'segundos')).toBe(30);
  });

  it('convierte minutos a segundos', () => {
    expect(convertirASegundos('5', 'minutos')).toBe(300);
  });

  it('convierte horas a segundos', () => {
    expect(convertirASegundos('2', 'horas')).toBe(7200);
  });

  it('devuelve 0 si la cantidad no es un número válido', () => {
    expect(convertirASegundos('', 'minutos')).toBe(0);
    expect(convertirASegundos('abc', 'horas')).toBe(0);
    expect(convertirASegundos('-3', 'segundos')).toBe(0);
  });
});
