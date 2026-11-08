jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { useMedicacionesStore, selectMedicacionesDe, selectMedicacion } from '../medicacionesStore';

beforeEach(() => {
  useMedicacionesStore.setState({ porUsuario: {} });
});

describe('medicacionesStore', () => {
  it('inicia sin medicaciones', () => {
    expect(useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com')).toEqual([]);
  });

  it('agrega una medicación con su foto', () => {
    useMedicacionesStore
      .getState()
      .agregar('sofia@gmail.com', 'Ibuprofeno', '08:00hs', 'file:///fotos/ibu.jpg');

    const lista = useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com');
    expect(lista).toHaveLength(1);
    expect(lista[0].nombre).toBe('Ibuprofeno');
    expect(lista[0].fotoUri).toBe('file:///fotos/ibu.jpg');
  });

  it('agrega una medicación sin foto', () => {
    useMedicacionesStore.getState().agregar('sofia@gmail.com', 'Paracetamol', '20:00hs');
    const lista = useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com');
    expect(lista[0].fotoUri).toBeUndefined();
  });

  it('elimina una medicación por id', () => {
    const nueva = useMedicacionesStore.getState().agregar('sofia@gmail.com', 'Ibuprofeno', '08:00hs');
    useMedicacionesStore.getState().eliminar('sofia@gmail.com', nueva.id);
    expect(useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com')).toHaveLength(0);
  });

  it('cada usuario ve solo sus medicaciones', () => {
    useMedicacionesStore.getState().agregar('sofia@gmail.com', 'Ibuprofeno', '08:00hs');
    useMedicacionesStore.getState().agregar('otro@gmail.com', 'Aspirina', '10:00hs');

    expect(useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com')).toHaveLength(1);
    expect(useMedicacionesStore.getState().getDeUsuario('otro@gmail.com')[0].nombre).toBe('Aspirina');
  });

  it('no distingue mayúsculas en el usuario', () => {
    useMedicacionesStore.getState().agregar('Sofia@Gmail.com', 'Ibuprofeno', '08:00hs');
    expect(useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com')).toHaveLength(1);
  });

  it('el selector devuelve una lista vacía si no hay usuario', () => {
    const estado = useMedicacionesStore.getState();
    expect(selectMedicacionesDe(null)(estado)).toEqual([]);
  });

  it('actualiza solo los campos indicados', () => {
    const nueva = useMedicacionesStore.getState().agregar('sofia@gmail.com', 'Ibuprofeno', '08:00hs');
    useMedicacionesStore.getState().actualizar('sofia@gmail.com', nueva.id, {
      farmacia: { direccion: 'Av. Mate de Luna 1234', origen: 'manual' },
    });

    const actualizada = useMedicacionesStore.getState().getDeUsuario('sofia@gmail.com')[0];
    expect(actualizada.farmacia?.direccion).toBe('Av. Mate de Luna 1234');
    expect(actualizada.nombre).toBe('Ibuprofeno'); 
  });

  it('actualizar con undefined quita el dato asociado', () => {
    const nueva = useMedicacionesStore.getState().agregar('sofia@gmail.com', 'Ibuprofeno', '08:00hs');
    const store = useMedicacionesStore.getState();
    store.actualizar('sofia@gmail.com', nueva.id, { contacto: { nombre: 'Mamá', origen: 'manual' } });
    store.actualizar('sofia@gmail.com', nueva.id, { contacto: undefined });

    expect(store.getDeUsuario('sofia@gmail.com')[0].contacto).toBeUndefined();
  });

  it('el selector de detalle encuentra la medicación por id', () => {
    const nueva = useMedicacionesStore.getState().agregar('sofia@gmail.com', 'Ibuprofeno', '08:00hs');
    const estado = useMedicacionesStore.getState();
    expect(selectMedicacion('sofia@gmail.com', nueva.id)(estado)?.nombre).toBe('Ibuprofeno');
    expect(selectMedicacion('sofia@gmail.com', 'no-existe')(estado)).toBeUndefined();
  });
});
