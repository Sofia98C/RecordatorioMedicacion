jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { useAuthStore } from '../authStore';

beforeEach(() => {
    useAuthStore.setState({ usuario: null });
});

describe('authStore', () => {
  it('inicia sin usuario logueado', () => {
    expect(useAuthStore.getState().usuario).toBeNull();
  });

  it('login guarda el usuario en minúsculas', () => {
    useAuthStore.getState().login('Sofia@Gmail.com');
    expect(useAuthStore.getState().usuario).toBe('sofia@gmail.com');
  });

  it('logout borra el usuario', () => {
    useAuthStore.getState().login('sofia@gmail.com');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().usuario).toBeNull();
  });
});
