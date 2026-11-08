import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/authStore";
import { RootStackParamList } from "./types";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";
import HomeScreen from "../screens/HomeScreen";
import AltaMedicacionScreen from "../screens/AltaMedicacionScreen";
import CamaraScreen from "../screens/CamaraScreen";
import DetalleMedicacionScreen from "../screens/DetalleMedicacionScreen";
import ContactosScreen from "../screens/ContactosScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const usuario = useAuthStore((s) => s.usuario);
  const hidratado = useAuthStore((s) => s.hidratado);
  const isAuthenticated = usuario !== null;

   
  if (!hidratado) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: "#6200ee" }, headerTintColor: "#fff" }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="AltaMedicacion"
              component={AltaMedicacionScreen}
              options={{ title: "Nueva medicación" }}
            />
            <Stack.Screen name="Camara" component={CamaraScreen} options={{ title: "Sacar foto" }} />
            <Stack.Screen
              name="DetalleMedicacion"
              component={DetalleMedicacionScreen}
              options={{ title: "Detalle" }}
            />
            <Stack.Screen
              name="Contactos"
              component={ContactosScreen}
              options={{ title: "Elegir contacto" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: "Registro" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
