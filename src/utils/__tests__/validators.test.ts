import { validarRegistro, validarMedicacion, esGmailValido } from '../validators';

describe('esGmailValido', () => {
  it('acepta un email que termina en @gmail.com', () => {
    expect(esGmailValido('sofia@gmail.com')).toBe(true);
  });

  it('rechaza un email de otro dominio', () => {
    expect(esGmailValido('sofia@hotmail.com')).toBe(false);
  });

  it('rechaza un usuario sin @', () => {
    expect(esGmailValido('sofia')).toBe(false);
  });
});

describe('validarRegistro', () => {
  it('retorna array vacío cuando usuario y password son válidos', () => {
    const errores = validarRegistro('sofia@gmail.com', 'clave123');
    expect(errores).toEqual([]);
  });

  it('retorna error si el usuario está vacío', () => {
    const errores = validarRegistro('', 'clave123');
    expect(errores).toContain('El usuario es requerido');
  });

  it('retorna error si el usuario no es un @gmail.com', () => {
    const errores = validarRegistro('sofia', 'clave123');
    expect(errores).toContain('El usuario debe ser un email @gmail.com');
  });

  it('retorna error si la contraseña está vacía', () => {
    const errores = validarRegistro('sofia@gmail.com', '');
    expect(errores).toContain('La contraseña es requerida');
  });

  it('retorna error si la contraseña tiene menos de 6 caracteres', () => {
    const errores = validarRegistro('sofia@gmail.com', '123');
    expect(errores).toContain('La contraseña debe tener al menos 6 caracteres');
  });

  it('retorna ambos errores si usuario y password son inválidos', () => {
    const errores = validarRegistro('', '');
    expect(errores).toHaveLength(2);
  });
});

describe('validarMedicacion', () => {
  it('retorna array vacío cuando nombre y hora son válidos', () => {
    expect(validarMedicacion('Ibuprofeno', '08:00hs')).toEqual([]);
  });

  it('retorna error si falta el nombre', () => {
    const errores = validarMedicacion('', '08:00hs');
    expect(errores).toContain('El nombre de la medicación es requerido');
  });

  it('retorna error si falta la hora', () => {
    const errores = validarMedicacion('Ibuprofeno', '');
    expect(errores).toContain('La hora de la medicación es requerida');
  });
});
