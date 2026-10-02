import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "./types";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";
import HomeScreen from "../screens/HomeScreen";
import AltaMedicacionScreen from "../screens/AltaMedicacionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se lee la sesión de AsyncStorage mostramos un loader
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Sin sesión solo existen Login y Registro: no se puede entrar a la app
  // sin iniciar sesión. Al hacer login/logout el navigator cambia solo.
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
