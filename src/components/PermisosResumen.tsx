import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EstadoPermiso, Recurso, NOMBRES_RECURSO } from '../utils/permisos';

type Props = {
  estados: Record<Recurso, EstadoPermiso>;
  recursos?: Recurso[]; 
};

const ETIQUETA: Record<EstadoPermiso, string> = {
  concedido: '✅ Concedido',
  denegado: '⛔ Denegado',
  pendiente: '⏳ Pendiente',
};


export default function PermisosResumen({ estados, recursos }: Props) {
  const lista = recursos ?? (Object.keys(estados) as Recurso[]);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Estado de los permisos</Text>
      {lista.map((recurso) => (
        <View key={recurso} style={styles.fila} testID={`permiso-${recurso}`}>
          <Text style={styles.recurso}>{NOMBRES_RECURSO[recurso]}</Text>
          <Text style={[styles.estado, styles[estados[recurso]]]}>{ETIQUETA[estados[recurso]]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  titulo: { fontWeight: 'bold', marginBottom: 8 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  recurso: { color: '#333' },
  estado: { fontWeight: 'bold' },
  concedido: { color: '#2e7d32' },
  denegado: { color: '#c0392b' },
  pendiente: { color: '#b07d00' },
});
