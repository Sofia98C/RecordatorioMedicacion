jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registrarUsuario,
  validarLogin,
  guardarSesion,
  obtenerSesion,
  cerrarSesion,
} from '../authStorage';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('registrarUsuario', () => {
  it('registra un usuario nuevo correctamente', async () => {
    const resultado = await registrarUsuario('sofia', 'clave123');
    expect(resultado.ok).toBe(true);
  });

  it('rechaza un usuario que ya existe', async () => {
    await registrarUsuario('sofia', 'clave123');
    const resultado = await registrarUsuario('sofia', 'otraClave');
    expect(resultado.ok).toBe(false);
    expect(resultado.error).toBe('El usuario ya existe');
  });
});

describe('validarLogin', () => {
  it('retorna true con usuario y contraseña correctos', async () => {
    await registrarUsuario('sofia', 'clave123');
    const esValido = await validarLogin('sofia', 'clave123');
    expect(esValido).toBe(true);
  });

  it('retorna false con contraseña incorrecta', async () => {
    await registrarUsuario('sofia', 'clave123');
    const esValido = await validarLogin('sofia', 'claveIncorrecta');
    expect(esValido).toBe(false);
  });

  it('retorna false si el usuario no existe', async () => {
    const esValido = await validarLogin('noexiste', 'clave123');
    expect(esValido).toBe(false);
  });
});

describe('sesión activa', () => {
  it('guarda y recupera la sesión activa', async () => {
    await guardarSesion('sofia');
    const sesion = await obtenerSesion();
    expect(sesion).toBe('sofia');
  });

  it('retorna null si no hay sesión guardada', async () => {
    const sesion = await obtenerSesion();
    expect(sesion).toBeNull();
  });

  it('elimina la sesión al cerrar sesión', async () => {
    await guardarSesion('sofia');
    await cerrarSesion();
    const sesion = await obtenerSesion();
    expect(sesion).toBeNull();
  });
});