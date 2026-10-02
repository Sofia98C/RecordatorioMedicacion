import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { validarLogin } from '../utils/authStorage';
import { esGmailValido } from '../utils/validators';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!usuario.trim() || !password) {
      Alert.alert('Faltan datos', 'Completá usuario y contraseña.');
      return;
    }

    if (!esGmailValido(usuario)) {
      Alert.alert('Usuario inválido', 'El usuario debe ser un email @gmail.com.');
      return;
    }

    // Validamos contra los usuarios guardados en AsyncStorage
    const esValido = await validarLogin(usuario.trim(), password);
    if (!esValido) {
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
      return;
    }

    // Al cambiar isAuthenticated, el AppNavigator muestra Home solo
    await login(usuario.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>💊 Recordatorio de Medicación</Text>
      <Text style={styles.subtitulo}>Iniciar sesión</Text>

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
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Ingresar" color="#6200ee" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.linkContainer}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitulo: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  linkContainer: { marginTop: 16 },
  link: { color: '#6200ee', textAlign: 'center' },
});
