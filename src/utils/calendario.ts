import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar/legacy';

async function obtenerCalendarioId(): Promise<string> {
  if (Platform.OS === 'ios') {
    const porDefecto = await Calendar.getDefaultCalendarAsync();
    return porDefecto.id;
  }

  const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const editable =
    calendarios.find((c) => c.allowsModifications && c.isPrimary) ??
    calendarios.find((c) => c.allowsModifications);
  if (editable) return editable.id;

  return Calendar.createCalendarAsync({
    title: 'Recordatorio de Medicación',
    color: '#6200ee',
    entityType: Calendar.EntityTypes.EVENT,
    source: { isLocalAccount: true, name: 'Recordatorio de Medicación', type: 'LOCAL' },
    name: 'recordatorio-medicacion',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

export async function crearEventoToma(nombre: string, inicio: Date): Promise<string> {
  const calendarioId = await obtenerCalendarioId();
  const fin = new Date(inicio.getTime() + 15 * 60 * 1000); 

  return Calendar.createEventAsync(calendarioId, {
    title: `💊 Tomar ${nombre}`,
    notes: 'Creado desde la app Recordatorio de Medicación',
    startDate: inicio,
    endDate: fin,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    alarms: [{ relativeOffset: -5 }], 
    recurrenceRule: { frequency: Calendar.Frequency.DAILY },
  });
}

export async function borrarEventoToma(eventoId: string): Promise<void> {
  try {
    await Calendar.deleteEventAsync(eventoId, { futureEvents: true });
  } catch (error) {
    console.log('[Calendario] No se pudo borrar el evento:', error);
  }
}
