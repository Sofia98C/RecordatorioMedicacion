import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Medicacion } from '../navigation/types';

type Props = {
  medicacion: Medicacion;
  onEliminar: (id: string) => void;
  onPress?: (id: string) => void; 
};


export default function MedicacionItem({ medicacion, onEliminar, onPress }: Props) {
  return (
    <View style={styles.card} testID={`medicacion-item-${medicacion.id}`}>
      {medicacion.fotoUri && (
        <Image
          source={{ uri: medicacion.fotoUri }}
          style={styles.foto}
          testID="medicacion-foto"
        />
      )}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => onPress?.(medicacion.id)}
        disabled={!onPress}
        testID="medicacion-detalle"
      >
        <Text style={styles.nombre} testID="medicacion-nombre">
          💊 {medicacion.nombre}
        </Text>
        <Text style={styles.hora} testID="medicacion-hora">
          {medicacion.hora}
        </Text>
        {medicacion.farmacia && (
          <Text style={styles.extra} numberOfLines={1} testID="medicacion-farmacia">
            📍 {medicacion.farmacia.direccion}
          </Text>
        )}
        {medicacion.contacto && (
          <Text style={styles.extra} numberOfLines={1} testID="medicacion-contacto">
            👤 {medicacion.contacto.nombre}
          </Text>
        )}
        {medicacion.eventoCalendarioId && (
          <Text style={styles.extra} testID="medicacion-calendario">
            📅 En tu calendario
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        testID="eliminar-button"
        onPress={() => onEliminar(medicacion.id)}
        style={styles.botonEliminar}
      >
        <Text style={styles.textoEliminar}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  foto: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  nombre: { fontSize: 16, fontWeight: 'bold' },
  hora: { color: '#666', marginTop: 2 },
  extra: { color: '#555', fontSize: 12, marginTop: 2 },
  botonEliminar: {
    backgroundColor: '#c0392b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoEliminar: { color: '#fff', fontWeight: 'bold' },
});
