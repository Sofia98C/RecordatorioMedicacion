import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Contact, ContactField, getPermissionsAsync } from 'expo-contacts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/authStore';
import { useMedicacionesStore } from '../stores/medicacionesStore';
import { ContactoAgenda, filtrarContactos } from '../utils/contactos';

type Props = NativeStackScreenProps<RootStackParamList, 'Contactos'>;

export default function ContactosScreen({ navigation, route }: Props) {
  const { medicacionId } = route.params;
  const usuario = useAuthStore((s) => s.usuario);
  const actualizar = useMedicacionesStore((s) => s.actualizar);

  const [contactos, setContactos] = useState<ContactoAgenda[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [sinPermiso, setSinPermiso] = useState(false);

  useEffect(() => {
    cargarContactos();
  }, []);

  const cargarContactos = async () => {
    try {
      const permiso = await getPermissionsAsync();
      if (permiso.status !== 'granted') {
        setSinPermiso(true);
        return;
      }

      const detalles = await Contact.getAllDetails(
        [ContactField.FULL_NAME, ContactField.PHONES] as const,
        { limit: 500 }
      );

      const lista: ContactoAgenda[] = detalles
        .filter((c) => c.fullName)
        .map((c) => ({
          id: c.id,
          nombre: c.fullName as string,
          telefono: c.phones?.[0]?.number ?? undefined,
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

      setContactos(lista);
    } catch (error) {
      console.log('[Contactos] Error al leer la agenda:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleElegir = (contacto: ContactoAgenda) => {
    if (!usuario) return;
    actualizar(usuario, medicacionId, {
      contacto: { nombre: contacto.nombre, telefono: contacto.telefono, origen: 'agenda' },
    });
    navigation.goBack();
  };

  if (sinPermiso) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>
          No tenemos permiso para leer tus contactos. Volvé y cargá el contacto a mano.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.mensaje}>Cargando contactos...</Text>
      </View>
    );
  }

  const filtrados = filtrarContactos(contactos, busqueda);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar por nombre…"
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.mensaje}>
            {busqueda ? `No hay contactos que coincidan con "${busqueda}".` : 'Tu agenda está vacía.'}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fila} onPress={() => handleElegir(item)}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            {item.telefono && <Text style={styles.telefono}>{item.telefono}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  buscador: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  fila: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nombre: { fontSize: 16 },
  telefono: { color: '#666', marginTop: 2 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  mensaje: { textAlign: 'center', color: '#666', marginTop: 12, paddingHorizontal: 16 },
  link: { color: '#6200ee', fontWeight: 'bold', marginTop: 16 },
});
