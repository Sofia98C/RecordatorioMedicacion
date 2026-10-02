import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicacion } from '../navigation/types';


function keyDe(usuario: string): string {
  return `@medicaciones_${usuario.toLowerCase()}`;
}

export async function getMedicaciones(usuario: string): Promise<Medicacion[]> {
  const data = await AsyncStorage.getItem(keyDe(usuario));
  return data ? JSON.parse(data) : [];
}

export async function agregarMedicacion(
  usuario: string,
  nombre: string,
  hora: string
): Promise<Medicacion> {
  const actuales = await getMedicaciones(usuario);
  const nueva: Medicacion = { id: Date.now().toString(), nombre, hora };
  const actualizadas = [...actuales, nueva];
  await AsyncStorage.setItem(keyDe(usuario), JSON.stringify(actualizadas));
  return nueva;
}

export async function eliminarMedicacion(usuario: string, id: string): Promise<Medicacion[]> {
  const actuales = await getMedicaciones(usuario);
  const actualizadas = actuales.filter((m) => m.id !== id);
  await AsyncStorage.setItem(keyDe(usuario), JSON.stringify(actualizadas));
  return actualizadas;
}
