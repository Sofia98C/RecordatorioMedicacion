import * as FileSystem from 'expo-file-system/legacy';

const CARPETA_FOTOS = `${FileSystem.documentDirectory}fotos/`;

export async function guardarFotoPermanente(uriTemporal: string): Promise<string> {
  await FileSystem.makeDirectoryAsync(CARPETA_FOTOS, { intermediates: true });
  const uriFinal = `${CARPETA_FOTOS}medicacion-${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: uriTemporal, to: uriFinal });
  return uriFinal;
}

export async function borrarFoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.log('[Fotos] No se pudo borrar la foto:', error);
  }
}
