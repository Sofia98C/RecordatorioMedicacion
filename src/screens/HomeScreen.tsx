import React from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../stores/authStore';
import { useMedicacionesStore, selectMedicacionesDe } from '../stores/medicacionesStore';
import MedicacionItem from '../components/MedicacionItem';
import { borrarFoto } from '../utils/fotos';
import { borrarEventoToma } from '../utils/calendario';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);

  const medicaciones = useMedicacionesStore(selectMedicacionesDe(usuario));
  const eliminar = useMedicacionesStore((s) => s.eliminar);

  const handleEliminar = async (id: string) => {
    if (!usuario) return;

    const medicacion = medicaciones.find((m) => m.id === id);
    if (medicacion?.fotoUri) {
      await borrarFoto(medicacion.fotoUri);
    }
    if (medicacion?.eventoCalendarioId) {
      await borrarEventoToma(medicacion.eventoCalendarioId);
    }

    eliminar(usuario, id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saludo}>Hola, {usuario} 👋</Text>
        <Button title="Cerrar sesión" color="#c0392b" onPress={logout} />
      </View>

      <FlatList
        data={medicaciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vacio}>Todavía no agregaste ninguna medicación.</Text>
        }
        renderItem={({ item }) => (
          <MedicacionItem
            medicacion={item}
            onEliminar={handleEliminar}
            onPress={(id) => navigation.navigate('DetalleMedicacion', { id })}
          />
        )}
      />

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate('AltaMedicacion')}
      >
        <Text style={styles.textoAgregar}>+ Agregar medicación</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  saludo: { fontSize: 16, fontWeight: 'bold' },
  lista: { padding: 16 },
  vacio: { textAlign: 'center', color: '#888', marginTop: 40 },
  botonAgregar: {
    backgroundColor: '#6200ee',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoAgregar: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
