import { calcularProximaToma, formatearHora } from '../horario';

const AHORA = new Date(2026, 10, 10, 12, 0); 

describe('calcularProximaToma', () => {
  it('si la hora todavía no pasó, la toma es hoy', () => {
    const toma = calcularProximaToma('20:30', AHORA)!;
    expect(toma.getDate()).toBe(10);
    expect(formatearHora(toma)).toBe('20:30');
  });

  it('si la hora ya pasó, la toma es mañana', () => {
    const toma = calcularProximaToma('08:00', AHORA)!;
    expect(toma.getDate()).toBe(11);
    expect(formatearHora(toma)).toBe('08:00');
  });

  it('acepta formatos como "8hs", "21.15" y "08:00hs"', () => {
    expect(formatearHora(calcularProximaToma('8hs', AHORA)!)).toBe('08:00');
    expect(formatearHora(calcularProximaToma('21.15', AHORA)!)).toBe('21:15');
    expect(formatearHora(calcularProximaToma('08:00hs', AHORA)!)).toBe('08:00');
  });

  it('devuelve null si la hora no es válida', () => {
    expect(calcularProximaToma('mañana', AHORA)).toBeNull();
    expect(calcularProximaToma('25:00', AHORA)).toBeNull();
    expect(calcularProximaToma('10:75', AHORA)).toBeNull();
  });
});
