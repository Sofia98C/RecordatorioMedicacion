// IMPORTANTE: no usar "import * as Notifications from 'expo-notifications'".
// Ese import completo carga también el código de push remoto, que Expo Go
// ya no soporta desde la SDK 53 y hace crashear la app apenas arranca.
// Importamos solo las funciones puntuales que necesitamos para notificaciones
// LOCALES, que es lo único que pide la consigna.
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
  // expo-notifications funciona mejor en un dispositivo físico; en emulador
  // puede comportarse raro. Solo avisamos, no bloqueamos nada.
  if (!Device.isDevice) {
    console.warn('[Notificaciones] Emulador detectado, puede no funcionar igual que en un celular real.');
  }
 
  // En Android 8+ es obligatorio crear un "canal" antes de poder notificar,
  // si no, la notificación puede no llegar a mostrarse aunque el permiso
  // esté concedido. Va en try/catch porque en Expo Go a veces falla, y no
  // queremos que eso frene el resto del flujo de permisos.
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
 
  // Primero CONSULTAMOS el permiso actual — si ya estaba concedido antes,
  // no hace falta volver a mostrarle el cartel al usuario cada vez.
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