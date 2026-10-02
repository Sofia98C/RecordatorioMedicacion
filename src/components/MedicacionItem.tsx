import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Medicacion } from '../navigation/types';

type Props = {
  medicacion: Medicacion;
  onEliminar: (id: string) => void;
};


export default function MedicacionItem({ medicacion, onEliminar }: Props) {
  return (
    <View style={styles.card} testID={`medicacion-item-${medicacion.id}`}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre} testID="medicacion-nombre">
          💊 {medicacion.nombre}
        </Text>
        <Text style={styles.hora} testID="medicacion-hora">
          {medicacion.hora}
        </Text>
      </View>
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
  nombre: { fontSize: 16, fontWeight: 'bold' },
  hora: { color: '#666', marginTop: 2 },
  botonEliminar: {
    backgroundColor: '#c0392b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoEliminar: { color: '#fff', fontWeight: 'bold' },
});
