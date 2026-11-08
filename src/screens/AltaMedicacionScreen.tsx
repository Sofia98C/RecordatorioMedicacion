import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { validarMedicacion } from '../utils/validators';
import { convertirASegundos, UnidadTiempo } from '../utils/tiempo';
import { useAuthStore } from '../stores/authStore';
import { useMedicacionesStore } from '../stores/medicacionesStore';
import { pedirPermisos, programarRecordatorioMedicacion } from '../utils/notifications';
import { guardarFotoPermanente } from '../utils/fotos';
import { usePermisos } from '../hooks/usePermisos';

type Props = NativeStackScreenProps<RootStackParamList, 'AltaMedicacion'>;

const UNIDADES: UnidadTiempo[] = ['segundos', 'minutos', 'horas'];

export default function AltaMedicacionScreen({ navigation, route }: Props) {
  const usuario = useAuthStore((s) => s.usuario);
  const agregar = useMedicacionesStore((s) => s.agregar);
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState('');
  const [cantidad, setCantidad] = useState('10');
  const [unidad, setUnidad] = useState<UnidadTiempo>('segundos');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const { pedir } = usePermisos();

  useEffect(() => {
    if (route.params?.fotoUri) {
      setFotoUri(route.params.fotoUri);
    }
  }, [route.params?.fotoUri]);

  const handleElegirDeGaleria = async () => {
    const concedido = await pedir('galeria');
    if (!concedido) return; 

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true, 
        aspect: [1, 1],      
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('[Alta] Error al abrir la galería:', error);
      Alert.alert('Error', 'No se pudo abrir la galería. Intentá de nuevo.');
    }
  };

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

    let fotoGuardada: string | undefined;
    if (fotoUri) {
      try {
        fotoGuardada = await guardarFotoPermanente(fotoUri);
      } catch (error) {
        console.log('[Alta] No se pudo guardar la foto:', error);
      }
    }

    agregar(usuario, nombre.trim(), hora.trim(), fotoGuardada);

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
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.label}>Foto del medicamento (opcional):</Text>
      {fotoUri ? (
        <View style={styles.fotoContenedor}>
          <Image source={{ uri: fotoUri }} style={styles.foto} />
          <TouchableOpacity onPress={() => setFotoUri(null)}>
            <Text style={styles.quitarFoto}>Quitar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.botonesFoto}>
          <TouchableOpacity style={styles.botonFoto} onPress={() => navigation.navigate('Camara')}>
            <Text style={styles.textoBotonFoto}>📷 Sacar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonFoto} onPress={handleElegirDeGaleria}>
            <Text style={styles.textoBotonFoto}>🖼️ Galería</Text>
          </TouchableOpacity>
        </View>
      )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, color: '#444', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  botonesFoto: { flexDirection: 'row', marginBottom: 16 },
  botonFoto: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  textoBotonFoto: { color: '#6200ee', fontWeight: 'bold' },
  fotoContenedor: { alignItems: 'center', marginBottom: 16 },
  foto: { width: 160, height: 160, borderRadius: 12, marginBottom: 8 },
  quitarFoto: { color: '#c0392b', fontWeight: 'bold' },
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
