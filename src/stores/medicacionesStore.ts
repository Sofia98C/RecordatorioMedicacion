import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicacion } from '../navigation/types';

interface MedicacionesStore {
  porUsuario: Record<string, Medicacion[]>;
  agregar: (usuario: string, nombre: string, hora: string, fotoUri?: string) => Medicacion;
  eliminar: (usuario: string, id: string) => void;
  actualizar: (usuario: string, id: string, cambios: Partial<Omit<Medicacion, 'id'>>) => void;
  getDeUsuario: (usuario: string) => Medicacion[];
}

const SIN_MEDICACIONES: Medicacion[] = [];

const clave = (usuario: string) => usuario.toLowerCase();

export const useMedicacionesStore = create<MedicacionesStore>()(
  persist(
    (set, get) => ({
      porUsuario: {},

      agregar: (usuario, nombre, hora, fotoUri) => {
        const nueva: Medicacion = { id: Date.now().toString(), nombre, hora, fotoUri };
        const key = clave(usuario);
        set((state) => ({
          porUsuario: {
            ...state.porUsuario,
            [key]: [...(state.porUsuario[key] ?? []), nueva],
          },
        }));
        return nueva;
      },

      eliminar: (usuario, id) => {
        const key = clave(usuario);
        set((state) => ({
          porUsuario: {
            ...state.porUsuario,
            [key]: (state.porUsuario[key] ?? []).filter((m) => m.id !== id),
          },
        }));
      },

      actualizar: (usuario, id, cambios) => {
        const key = clave(usuario);
        set((state) => ({
          porUsuario: {
            ...state.porUsuario,
            [key]: (state.porUsuario[key] ?? []).map((m) =>
              m.id === id ? { ...m, ...cambios } : m
            ),
          },
        }));
      },

      getDeUsuario: (usuario) => get().porUsuario[clave(usuario)] ?? SIN_MEDICACIONES,
    }),
    {
      name: 'medicaciones-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ porUsuario: state.porUsuario }),
    }
  )
);

export const selectMedicacion = (usuario: string | null, id: string) => (state: MedicacionesStore) =>
  usuario ? state.porUsuario[clave(usuario)]?.find((m) => m.id === id) : undefined;

export const selectMedicacionesDe = (usuario: string | null) => (state: MedicacionesStore) =>
  usuario ? state.porUsuario[clave(usuario)] ?? SIN_MEDICACIONES : SIN_MEDICACIONES;
