import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3001'; // Cambiar por IP local para pruebas en móvil real

const ChatScreen = () => {
  const { coupleId } = useAuth();
  const [messages, setMessages] = useState([
    { id: '1', text: '¡Hola, mi niña! Soy Hello Kitty 🎀. ¿Cómo estás hoy?', sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    // Conectar WebSocket
    socket.current = io(API_URL);
    socket.current.emit('join_couple', coupleId);

    // Escuchar alertas en tiempo real
    socket.current.on('receive_alert', (data) => {
      console.log('Alerta recibida:', data);
      // Cuando llega una alerta, podríamos activar a Hello Kitty automáticamente
      // o guardar el contexto para el siguiente mensaje
    });

    return () => socket.current.disconnect();
  }, [coupleId]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newUserMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        coupleId,
        message: inputText,
        useAI: true
      });

      const kittyResponse = { 
        id: (Date.now() + 1).toString(), 
        text: response.data.response, 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, kittyResponse]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.sender === 'user' ? styles.userBubble : styles.aiBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hello Kitty Assistant 🎀</Text>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Habla con Hello Kitty..."
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>🎀</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    paddingTop: 50, paddingBottom: 20, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center',
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  chatList: { padding: SPACING.m },
  messageBubble: { 
    maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: SPACING.s 
  },
  userBubble: { 
    alignSelf: 'flex-end', backgroundColor: COLORS.secondary, borderBottomRightRadius: 2 
  },
  aiBubble: { 
    alignSelf: 'flex-start', backgroundColor: COLORS.white, borderBottomLeftRadius: 2,
    borderWidth: 1, borderColor: COLORS.secondary 
  },
  messageText: { color: COLORS.text, fontSize: 16 },
  inputContainer: { 
    flexDirection: 'row', padding: SPACING.m, 
    backgroundColor: COLORS.white, alignItems: 'center' 
  },
  input: { 
    flex: 1, backgroundColor: COLORS.tertiary, borderRadius: 20, 
    paddingHorizontal: 15, height: 40, color: COLORS.text 
  },
  sendButton: { marginLeft: 10, backgroundColor: COLORS.primary, padding: 8, borderRadius: 20 },
  sendButtonText: { fontSize: 20 }
});

export default ChatScreen;
