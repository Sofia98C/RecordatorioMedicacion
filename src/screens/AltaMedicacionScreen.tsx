import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { validarMedicacion } from '../utils/validators';
import { convertirASegundos, UnidadTiempo } from '../utils/tiempo';
import { useAuth } from '../context/AuthContext';
import { agregarMedicacion } from '../utils/medicacionesStorage';
import { pedirPermisos, programarRecordatorioMedicacion } from '../utils/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'AltaMedicacion'>;

const UNIDADES: UnidadTiempo[] = ['segundos', 'minutos', 'horas'];

export default function AltaMedicacionScreen({ navigation }: Props) {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState('');
  // Cuándo queremos que suene el recordatorio: una cantidad y una unidad
  const [cantidad, setCantidad] = useState('10');
  const [unidad, setUnidad] = useState<UnidadTiempo>('segundos');

  const handleGuardar = async () => {
    const errores = validarMedicacion(nombre, hora);
    const segundos = convertirASegundos(cantidad, unidad);
    if (segundos === 0) {
      errores.push('Ingresá en cuánto tiempo querés el recordatorio');
    }
    if (errores.length > 0) {
      Alert.alert('Revisá los datos', errores.join('\n'));
      return;
    }

    if (!usuario) return;

    await agregarMedicacion(usuario, nombre.trim(), hora.trim());

    const permisoConcedido = await pedirPermisos();
    if (permisoConcedido) {
      await programarRecordatorioMedicacion(nombre.trim(), segundos);
      Alert.alert('Guardado ✅', `El recordatorio va a sonar en ${cantidad} ${unidad}.`);
    } else {
      Alert.alert('Guardado ✅', 'Medicación guardada (sin notificación: permiso no concedido).');
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nueva medicación</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del medicamento"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (ej: 08:00hs)"
        value={hora}
        onChangeText={setHora}
      />

      <Text style={styles.label}>Recordarme en:</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
      />

      <View style={styles.opciones}>
        {UNIDADES.map((u) => (
          <TouchableOpacity
            key={u}
            style={[styles.opcion, unidad === u && styles.opcionActiva]}
            onPress={() => setUnidad(u)}
          >
            <Text style={[styles.textoOpcion, unidad === u && styles.textoOpcionActiva]}>{u}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
        <Text style={styles.textoBoton}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, color: '#444', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  opciones: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  opcion: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  opcionActiva: { backgroundColor: '#6200ee' },
  textoOpcion: { color: '#6200ee', fontWeight: 'bold' },
  textoOpcionActiva: { color: '#fff' },
  boton: { backgroundColor: '#6200ee', padding: 14, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
});
