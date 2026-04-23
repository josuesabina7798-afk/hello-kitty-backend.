const io = require('socket.io-client');
const axios = require('axios');

async function runTest() {
  console.log('--- EMPEZANDO PRUEBA TÉCNICA HELLO KITTY 🎀 ---');
  
  const API_URL = 'http://localhost:3001';
  const coupleId = 'DEMO-LOVE-2024';

  // 1. Simular conexión del socket
  const socket = io(API_URL);
  
  socket.on('connect', async () => {
    console.log('✔ Conectado al servidor de Hello Kitty.');
    socket.emit('join_couple', coupleId);

    // 2. Simular que el Novio envía un aviso
    console.log('👦 El novio envía un aviso: "Hoy no desayunó nada, se siente débil".');
    socket.emit('send_alert', {
      coupleId,
      category: 'Comida',
      content: 'Hoy no desayunó nada, se siente débil'
    });

    // Esperar un momento para que el servidor procese el contexto
    setTimeout(async () => {
      // 3. Simular que la Novia saluda a Hello Kitty
      console.log('👧 La novia saluda: "Hola Kitty, me siento un poco rara hoy"');
      
      try {
        const response = await axios.post(`${API_URL}/api/chat`, {
          coupleId,
          message: 'Hola Kitty, me siento un poco rara hoy',
          useAI: false // Forzamos modo offline para la prueba sin API Key
        });

        console.log('\x1b[35m%s\x1b[0m', `🎀 Hello Kitty responde: "${response.data.response}"`);
        
        console.log('--- PRUEBA FINALIZADA CON ÉXITO ---');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error en el chat:', error.message);
        process.exit(1);
      }
    }, 1000);
  });
}

runTest();
