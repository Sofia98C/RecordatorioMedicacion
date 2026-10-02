import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../navigation/types';

const KEY_USUARIOS = '@usuarios';
const KET_SESION = '@session_activa';

async function getUsuarios(): Promise<Usuario[]> {
    const data = await AsyncStorage.getItem(KEY_USUARIOS);
    return data ? JSON.parse(data) : [];
}
export async function registrarUsuario(
    usuario:string,
    password: string

): Promise<{ok: boolean; error?: string}>{
    const usuarios = await getUsuarios();

    const yaExiste = usuarios.some((u) => u.usuario.toLowerCase() === usuario.toLowerCase());
    if (yaExiste) {
        return { ok: false, error: 'El usuario ya existe' };
    }

    usuarios.push({usuario, password});
    await AsyncStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
    return { ok: true };
}

export async function validarLogin(usuario: string, password: string): Promise<boolean>{
    const usuarios = await getUsuarios();
    return usuarios.some((u) => u.usuario.toLowerCase() === usuario.toLowerCase() && u.password === password);
}

export async function guardarSesion(usuario: string):Promise<void>{
    await AsyncStorage.setItem(KET_SESION, usuario);
}

export async function obtenerSesion(): Promise<string | null> {
    return await AsyncStorage.getItem(KET_SESION);
}

export async function cerrarSesion(): Promise<void> {
    await AsyncStorage.removeItem(KET_SESION);
}