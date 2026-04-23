import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3001';

const categories = ["Comida", "Sueño", "Ánimo", "Salud", "Estrés"];

const AlertFormScreen = () => {
  const { coupleId } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Comida");
  const [content, setContent] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(API_URL);
    return () => socket.current.disconnect();
  }, []);

  const sendAlert = () => {
    if (content.trim() === '') {
      Alert.alert("Escribe algo", "Por favor describe el aviso para Hello Kitty");
      return;
    }

    socket.current.emit('send_alert', {
      coupleId,
      category: selectedCategory,
      content: content
    });

    Alert.alert("¡Enviado! 🎀", "Hello Kitty ahora sabe qué hacer.");
    setContent('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enviar Aviso 🎀</Text>
        <Text style={styles.headerSubtitle}>Hello Kitty los entregará con amor</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Sobre qué es el aviso?</Text>
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat}
              style={[
                styles.categoryButton, 
                selectedCategory === cat && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.selectedCategoryText
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles (Contexto Oculto)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
          placeholder="Ej: No ha comido casi nada hoy, dice que le duele la panza..."
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={sendAlert}>
        <Text style={styles.sendButtonText}>Enviar a Hello Kitty 🎀</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    padding: SPACING.l, paddingTop: 60, 
    backgroundColor: COLORS.primary, 
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30 
  },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: COLORS.white, opacity: 0.9 },
  section: { padding: SPACING.m, marginTop: SPACING.m },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: SPACING.s },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryButton: { 
    paddingVertical: 8, paddingHorizontal: 15, 
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary 
  },
  selectedCategory: { backgroundColor: COLORS.primary },
  categoryText: { color: COLORS.primary },
  selectedCategoryText: { color: COLORS.white },
  textArea: { 
    backgroundColor: COLORS.white, borderRadius: 15, padding: 15, 
    height: 100, textAlignVertical: 'top', 
    borderWidth: 1, borderColor: COLORS.tertiary, color: COLORS.text 
  },
  sendButton: { 
    margin: SPACING.m, backgroundColor: COLORS.primary, 
    padding: 15, borderRadius: 25, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },
  sendButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }
});

export default AlertFormScreen;
