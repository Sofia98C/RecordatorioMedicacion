import * as Device from 'expo-device';
import { Alert, Linking, Platform } from 'react-native';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
 
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
 
export async function pedirPermisos(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('[Notificaciones] Emulador detectado, puede no funcionar igual que en un celular real.');
  }
 
  
  if (Platform.OS === 'android') {
    try {
      await setNotificationChannelAsync('recordatorios', {
        name: 'Recordatorios de medicación',
        importance: AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    } catch (err) {
      console.warn('[Notificaciones] No se pudo crear el canal de Android:', err);
    }
  }
 
  const existente = await getPermissionsAsync();
  let estadoFinal = existente.status;
  let puedePreguntarDeNuevo = existente.canAskAgain;
 
  if (existente.status !== 'granted') {
    const pedido = await requestPermissionsAsync({
      android: {},
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    estadoFinal = pedido.status;
    puedePreguntarDeNuevo = pedido.canAskAgain;
  }
 
  const concedido = estadoFinal === 'granted';
 
  if (!concedido) {
    Alert.alert(
      'Permisos de notificación desactivados',
      puedePreguntarDeNuevo
        ? 'No se concedió el permiso. Podés intentar de nuevo tocando el botón.'
        : 'El permiso fue denegado antes. Activalo manualmente desde los ajustes del sistema.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
      ]
    );
  }
 
  return concedido;
}
 
export async function programarRecordatorioMedicacion(
  nombreMedicamento: string,
  segundos: number
): Promise<void> {
  await scheduleNotificationAsync({
    content: {
      title: '💊 Hora de tu medicación',
      body: `Es momento de tomar: ${nombreMedicamento}`,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      repeats: false,
    },
  });
}