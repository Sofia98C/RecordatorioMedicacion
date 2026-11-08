import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/authStore';
import { useMedicacionesStore, selectMedicacion } from '../stores/medicacionesStore';
import { usePermisos } from '../hooks/usePermisos';
import PermisosResumen from '../components/PermisosResumen';
import { formatearDireccion, formatearCoordenadas, linkMapa } from '../utils/ubicacion';
import { calcularProximaToma, formatearHora } from '../utils/horario';
import { crearEventoToma, borrarEventoToma } from '../utils/calendario';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleMedicacion'>;

export default function DetalleMedicacionScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const usuario = useAuthStore((s) => s.usuario);
  const medicacion = useMedicacionesStore(selectMedicacion(usuario, id));
  const actualizar = useMedicacionesStore((s) => s.actualizar);
  const { estados, pedir } = usePermisos();

  const [editandoDireccion, setEditandoDireccion] = useState(false);
  const [direccionManual, setDireccionManual] = useState('');
  const [editandoContacto, setEditandoContacto] = useState(false);
  const [nombreContacto, setNombreContacto] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');

  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [agendando, setAgendando] = useState(false);

  if (!medicacion || !usuario) {
    return (
      <View style={styles.centrado}>
        <Text>Esta medicación ya no existe.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUsarUbicacion = async () => {
    const concedido = await pedir('ubicacion');
    if (!concedido) {
      setEditandoDireccion(true); 
      return;
    }

    const gpsActivo = await Location.hasServicesEnabledAsync();
    if (!gpsActivo) {
      Alert.alert('GPS apagado', 'Activá la ubicación del celular o escribí la dirección a mano.');
      return;
    }

    try {
      setBuscandoUbicacion(true);
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = posicion.coords;

      const direcciones = await Location.reverseGeocodeAsync({ latitude, longitude });

      actualizar(usuario, id, {
        farmacia: {
          direccion: formatearDireccion(direcciones[0]),
          latitud: latitude,
          longitud: longitude,
          origen: 'gps',
        },
      });
    } catch (error) {
      console.log('[Ubicación] Error:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación. Probá escribirla a mano.');
    } finally {
      setBuscandoUbicacion(false);
    }
  };

  const handleGuardarDireccion = () => {
    if (!direccionManual.trim()) {
      Alert.alert('Falta la dirección', 'Escribí la dirección de la farmacia.');
      return;
    }
    actualizar(usuario, id, { farmacia: { direccion: direccionManual.trim(), origen: 'manual' } });
    setEditandoDireccion(false);
    setDireccionManual('');
  };

  const handleElegirContacto = async () => {
    const concedido = await pedir('contactos');
    if (concedido) {
      navigation.navigate('Contactos', { medicacionId: id });
    } else {
      setEditandoContacto(true); 
    }
  };

  const handleGuardarContacto = () => {
    if (!nombreContacto.trim()) {
      Alert.alert('Falta el nombre', 'Escribí el nombre del médico o familiar.');
      return;
    }
    actualizar(usuario, id, {
      contacto: {
        nombre: nombreContacto.trim(),
        telefono: telefonoContacto.trim() || undefined,
        origen: 'manual',
      },
    });
    setEditandoContacto(false);
    setNombreContacto('');
    setTelefonoContacto('');
  };


  const handleAgendar = async () => {
    const proximaToma = calcularProximaToma(medicacion.hora);
    if (!proximaToma) {
      Alert.alert(
        'No entendemos la hora',
        `"${medicacion.hora}" no tiene un formato válido. Usá por ejemplo 08:00 o 20hs.`
      );
      return;
    }

    const concedido = await pedir('calendario');
    if (!concedido) return; 

    try {
      setAgendando(true);
      const eventoId = await crearEventoToma(medicacion.nombre, proximaToma);
      actualizar(usuario, id, { eventoCalendarioId: eventoId });
      Alert.alert('Agendado 📅', `Se agregó al calendario todos los días a las ${formatearHora(proximaToma)}.`);
    } catch (error) {
      console.log('[Calendario] Error:', error);
      Alert.alert('Error', 'No se pudo crear el evento en el calendario.');
    } finally {
      setAgendando(false);
    }
  };

  const handleQuitarDelCalendario = async () => {
    if (medicacion.eventoCalendarioId) {
      await borrarEventoToma(medicacion.eventoCalendarioId);
    }
    actualizar(usuario, id, { eventoCalendarioId: undefined });
  };

  const proximaToma = calcularProximaToma(medicacion.hora);
  const { farmacia, contacto } = medicacion;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {medicacion.fotoUri ? (
        <Image source={{ uri: medicacion.fotoUri }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.sinFoto]}>
          <Text style={styles.sinFotoTexto}>💊</Text>
        </View>
      )}
      <Text style={styles.nombre}>{medicacion.nombre}</Text>
      <Text style={styles.hora}>🕐 {medicacion.hora}</Text>

      <PermisosResumen estados={estados} />

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>📍 Farmacia</Text>
        {farmacia ? (
          <>
            <Text style={styles.dato}>{farmacia.direccion}</Text>
            {farmacia.latitud !== undefined && farmacia.longitud !== undefined && (
              <>
                <Text style={styles.detalle}>
                  {formatearCoordenadas(farmacia.latitud, farmacia.longitud)} · por GPS
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(linkMapa(farmacia.latitud!, farmacia.longitud!))}
                >
                  <Text style={styles.link}>🗺️ Ver en el mapa</Text>
                </TouchableOpacity>
              </>
            )}
            {farmacia.origen === 'manual' && <Text style={styles.detalle}>Cargada a mano</Text>}
            <TouchableOpacity onPress={() => actualizar(usuario, id, { farmacia: undefined })}>
              <Text style={styles.quitar}>Quitar</Text>
            </TouchableOpacity>
          </>
        ) : editandoDireccion ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Dirección de la farmacia"
              value={direccionManual}
              onChangeText={setDireccionManual}
            />
            <View style={styles.fila}>
              <TouchableOpacity style={styles.boton} onPress={handleGuardarDireccion}>
                <Text style={styles.textoBoton}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditandoDireccion(false)}>
                <Text style={styles.link}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.boton}
              onPress={handleUsarUbicacion}
              disabled={buscandoUbicacion}
            >
              {buscandoUbicacion ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBoton}>Usar mi ubicación actual</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditandoDireccion(true)}>
              <Text style={styles.link}>✍️ Escribir la dirección a mano</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>👤 Médico o familiar</Text>
        {contacto ? (
          <>
            <Text style={styles.dato}>{contacto.nombre}</Text>
            {contacto.telefono && <Text style={styles.detalle}>{contacto.telefono}</Text>}
            <Text style={styles.detalle}>
              {contacto.origen === 'agenda' ? 'De tus contactos' : 'Cargado a mano'}
            </Text>
            {contacto.telefono && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${contacto.telefono}`)}>
                <Text style={styles.link}>📞 Llamar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => actualizar(usuario, id, { contacto: undefined })}>
              <Text style={styles.quitar}>Quitar</Text>
            </TouchableOpacity>
          </>
        ) : editandoContacto ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombreContacto}
              onChangeText={setNombreContacto}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (opcional)"
              value={telefonoContacto}
              onChangeText={setTelefonoContacto}
              keyboardType="phone-pad"
            />
            <View style={styles.fila}>
              <TouchableOpacity style={styles.boton} onPress={handleGuardarContacto}>
                <Text style={styles.textoBoton}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditandoContacto(false)}>
                <Text style={styles.link}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.boton} onPress={handleElegirContacto}>
              <Text style={styles.textoBoton}>Elegir de mis contactos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditandoContacto(true)}>
              <Text style={styles.link}>✍️ Cargarlo a mano</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>📅 Calendario</Text>
        {medicacion.eventoCalendarioId ? (
          <>
            <Text style={styles.dato}>
              ✅ Agendado todos los días{proximaToma ? ` a las ${formatearHora(proximaToma)}` : ''}
            </Text>
            <TouchableOpacity onPress={handleQuitarDelCalendario}>
              <Text style={styles.quitar}>Quitar del calendario</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.boton} onPress={handleAgendar} disabled={agendando}>
            {agendando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBoton}>Agregar la toma al calendario</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  foto: { width: 160, height: 160, borderRadius: 16, alignSelf: 'center', marginBottom: 12 },
  sinFoto: { backgroundColor: '#ece6f8', justifyContent: 'center', alignItems: 'center' },
  sinFotoTexto: { fontSize: 56 },
  nombre: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  hora: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 },
  seccion: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tituloSeccion: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  dato: { fontSize: 15, marginBottom: 4 },
  detalle: { color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  boton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    minWidth: 120,
  },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#6200ee', fontWeight: 'bold', marginTop: 6 },
  quitar: { color: '#c0392b', fontWeight: 'bold', marginTop: 8 },
});
