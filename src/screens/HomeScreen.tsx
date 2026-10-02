import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Medicacion } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { getMedicaciones, eliminarMedicacion } from '../utils/medicacionesStorage';
import MedicacionItem from '../components/MedicacionItem';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { usuario, logout } = useAuth();
  const [medicaciones, setMedicaciones] = useState<Medicacion[]>([]);

  // Home queda montada cuando vamos a AltaMedicacion, así que un useEffect
  // común no se vuelve a ejecutar al volver. useFocusEffect corre cada vez
  // que la pantalla toma foco, y así la lista siempre está actualizada.
  useFocusEffect(
    useCallback(() => {
      if (usuario) {
        getMedicaciones(usuario).then(setMedicaciones);
      }
    }, [usuario])
  );

  const handleEliminar = async (id: string) => {
    if (!usuario) return;
    const actualizadas = await eliminarMedicacion(usuario, id);
    setMedicaciones(actualizadas);
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
        renderItem={({ item }) => <MedicacionItem medicacion={item} onEliminar={handleEliminar} />}
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
