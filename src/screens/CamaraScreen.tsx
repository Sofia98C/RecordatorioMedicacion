import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Camara'>;

export default function CamaraScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission, getPermission] = useCameraPermissions();

  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') getPermission();
    });
    return () => suscripcion.remove();
  }, [getPermission]);

  const [facing, setFacing] = useState<CameraType>('back');

  const [capturando, setCapturando] = useState(false);

  if (!permission) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.textoCarga}>Verificando permisos…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={styles.titulo}>Sin acceso a la cámara</Text>
        <Text style={styles.descripcion}>
          Para sacarle foto al medicamento necesitamos permiso para usar la cámara.
        </Text>

        {permission.canAskAgain ? (
          <TouchableOpacity style={styles.boton} onPress={requestPermission}>
            <Text style={styles.textoBoton}>Dar permiso</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.boton} onPress={() => Linking.openSettings()}>
            <Text style={styles.textoBoton}>Abrir ajustes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotonSecundario}>Volver y elegir de la galería</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapturar = async () => {
    if (!cameraRef.current || capturando) return;

    try {
      setCapturando(true);
      const foto = await cameraRef.current.takePictureAsync({ quality: 0.7 });

      if (foto?.uri) {
        navigation.popTo('AltaMedicacion', { fotoUri: foto.uri });
      }
    } catch (error) {
      console.log('[Camara] Error al sacar la foto:', error);
      Alert.alert('Error', 'No se pudo sacar la foto. Intentá de nuevo.');
    } finally {
      setCapturando(false);
    }
  };

  const cambiarCamara = () => {
    setFacing((actual) => (actual === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.contenedor}>
      <CameraView ref={cameraRef} style={styles.camara} facing={facing}>
        <View style={styles.controles}>
          <TouchableOpacity style={styles.botonCambiar} onPress={cambiarCamara}>
            <Text style={styles.iconoCambiar}>🔄</Text>
            <Text style={styles.textoCambiar}>Cambiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.disparador}
            onPress={handleCapturar}
            disabled={capturando}
          >
            {capturando ? (
              <ActivityIndicator color="#6200ee" size="large" />
            ) : (
              <View style={styles.disparadorInterno} />
            )}
          </TouchableOpacity>

          <View style={styles.botonCambiar} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000' },
  camara: { flex: 1, justifyContent: 'flex-end' },
  controles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  botonCambiar: { width: 64, alignItems: 'center' },
  iconoCambiar: { fontSize: 28 },
  textoCambiar: { color: '#fff', fontSize: 12, marginTop: 4 },
  disparador: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disparadorInterno: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoCarga: { marginTop: 12, color: '#666' },
  emoji: { fontSize: 48, marginBottom: 12 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  descripcion: { textAlign: 'center', color: '#666', marginBottom: 24 },
  boton: {
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
  botonSecundario: { padding: 12 },
  textoBotonSecundario: { color: '#6200ee', fontWeight: 'bold' },
});