import { useCallback, useEffect, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar/legacy';
import {
  EstadoPermiso,
  Recurso,
  mapearEstado,
  NOMBRES_RECURSO,
  MOTIVO_RECURSO,
} from '../utils/permisos';

type PermisoResponse = { status: string; canAskAgain: boolean };

const CONSULTAR: Record<Recurso, () => Promise<PermisoResponse>> = {
  camara: () => Camera.getCameraPermissionsAsync(),
  galeria: () => ImagePicker.getMediaLibraryPermissionsAsync(),
  ubicacion: () => Location.getForegroundPermissionsAsync(),
  contactos: () => Contacts.getPermissionsAsync(),
  calendario: () => Calendar.getCalendarPermissionsAsync(),
};

const PEDIR: Record<Recurso, () => Promise<PermisoResponse>> = {
  camara: () => Camera.requestCameraPermissionsAsync(),
  galeria: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
  ubicacion: () => Location.requestForegroundPermissionsAsync(),
  contactos: () => Contacts.requestPermissionsAsync(),
  calendario: () => Calendar.requestCalendarPermissionsAsync(),
};

const RECURSOS: Recurso[] = ['camara', 'galeria', 'ubicacion', 'contactos', 'calendario'];

export type EstadosPermisos = Record<Recurso, EstadoPermiso>;

const ESTADOS_INICIALES: EstadosPermisos = {
  camara: 'pendiente',
  galeria: 'pendiente',
  ubicacion: 'pendiente',
  contactos: 'pendiente',
  calendario: 'pendiente',
};

export function usePermisos() {
  const [estados, setEstados] = useState<EstadosPermisos>(ESTADOS_INICIALES);

  const refrescar = useCallback(async () => {
    const nuevos = { ...ESTADOS_INICIALES };
    for (const recurso of RECURSOS) {
      try {
        const respuesta = await CONSULTAR[recurso]();
        nuevos[recurso] = mapearEstado(respuesta.status);
      } catch (error) {
        console.log(`[Permisos] No se pudo consultar ${recurso}:`, error);
      }
    }
    setEstados(nuevos);
  }, []);

  useEffect(() => {
    refrescar();
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') refrescar();
    });
    return () => suscripcion.remove();
  }, [refrescar]);

 
  const pedir = useCallback(async (recurso: Recurso): Promise<boolean> => {
    try {
      let respuesta = await CONSULTAR[recurso]();

      if (respuesta.status !== 'granted' && respuesta.canAskAgain) {
        respuesta = await PEDIR[recurso]();
      }

      setEstados((anteriores) => ({ ...anteriores, [recurso]: mapearEstado(respuesta.status) }));

      if (respuesta.status === 'granted') return true;

      mostrarRechazo(recurso, respuesta.canAskAgain);
      return false;
    } catch (error) {
      console.log(`[Permisos] Error al pedir ${recurso}:`, error);
      Alert.alert('Error', `No se pudo pedir el permiso de ${NOMBRES_RECURSO[recurso]}.`);
      return false;
    }
  }, []);

  return { estados, pedir, refrescar };
}

function mostrarRechazo(recurso: Recurso, canAskAgain: boolean) {
  const botones: { text: string; onPress?: () => void; style?: 'cancel' }[] = [
    { text: 'Entendido', style: 'cancel' },
  ];
  if (!canAskAgain) {
    botones.push({ text: 'Abrir ajustes', onPress: () => Linking.openSettings() });
  }
  Alert.alert(`Permiso de ${NOMBRES_RECURSO[recurso]} denegado`, MOTIVO_RECURSO[recurso], botones);
}
