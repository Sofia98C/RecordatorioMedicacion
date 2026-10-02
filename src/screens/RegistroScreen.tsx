import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { validarRegistro } from '../utils/validators';
import { registrarUsuario } from '../utils/authStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

export default function RegistroScreen({ navigation }: Props) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistro = async () => {
    const errores = validarRegistro(usuario, password);
    if (errores.length > 0) {
      Alert.alert('Revisá los datos', errores.join('\n'));
      return;
    }

    const resultado = await registrarUsuario(usuario.trim(), password);
    if (!resultado.ok) {
      Alert.alert('Error', resultado.error ?? 'No se pudo registrar');
      return;
    }

    Alert.alert('¡Listo!', 'Usuario creado. Ahora podés iniciar sesión.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Email (@gmail.com)"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Elegí una contraseña (mín. 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Registrarme" color="#6200ee" onPress={handleRegistro} />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkContainer}>
        <Text style={styles.link}>Ya tengo cuenta, volver al login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  linkContainer: { marginTop: 16 },
  link: { color: '#6200ee', textAlign: 'center' },
});
