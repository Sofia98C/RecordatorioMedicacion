import { filtrarContactos } from '../contactos';

const AGENDA = [
  { id: '1', nombre: 'Dra. Laura Gómez', telefono: '381111111' },
  { id: '2', nombre: 'Mamá' },
  { id: '3', nombre: 'Dr. Pablo Ruiz' },
];

describe('filtrarContactos', () => {
  it('sin texto devuelve todos', () => {
    expect(filtrarContactos(AGENDA, '')).toHaveLength(3);
  });

  it('filtra por nombre sin importar mayúsculas', () => {
    const resultado = filtrarContactos(AGENDA, 'GÓMEZ');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('1');
  });

  it('devuelve lista vacía si no hay coincidencias', () => {
    expect(filtrarContactos(AGENDA, 'zzz')).toEqual([]);
  });
});
