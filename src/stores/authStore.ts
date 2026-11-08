import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthStore {
  usuario: string | null;     
  hidratado: boolean;         
  login: (usuario: string) => void;
  logout: () => void;
  setHidratado: (valor: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      usuario: null,
      hidratado: false,

      login: (usuario) => set({ usuario: usuario.trim().toLowerCase() }),

      logout: () => set({ usuario: null }),

      setHidratado: (valor) => set({ hidratado: valor }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ usuario: state.usuario }),
      onRehydrateStorage: () => (state) => {
        state?.setHidratado(true);
      },
    }
  )
);
