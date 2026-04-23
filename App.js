import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import ChatScreen from './src/screens/Asistida/ChatScreen';
import AlertFormScreen from './src/screens/Cuidador/AlertFormScreen';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from './src/constants/theme';

const Stack = createStackNavigator();

const RoleSelector = ({ navigation }) => {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido! 🎀</Text>
      <Text style={styles.subtitle}>Selecciona tu rol para probar</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => { login('caregiver'); navigation.replace('CaregiverApp'); }}
      >
        <Text style={styles.buttonText}>Soy el Novio (Cuidador) 👦</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: COLORS.secondary }]} 
        onPress={() => { login('assisted'); navigation.replace('AssistedApp'); }}
      >
        <Text style={[styles.buttonText, { color: COLORS.primary }]}>Soy la Novia (Asistida) 👧</Text>
      </TouchableOpacity>
    </View>
  );
};

const AppContent = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={RoleSelector} />
        <Stack.Screen name="CaregiverApp" component={AlertFormScreen} />
        <Stack.Screen name="AssistedApp" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: COLORS.text, marginBottom: 40 },
  button: { 
    width: '100%', padding: 20, borderRadius: 15, 
    backgroundColor: COLORS.primary, marginBottom: 20, alignItems: 'center' 
  },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }
});
