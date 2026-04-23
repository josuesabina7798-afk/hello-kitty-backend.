const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { getHelloKittyResponse } = require('./services/groq.service');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(cors());
app.use(express.json());

const activeContexts = new Map();

io.on('connection', (socket) => {
  socket.on('join_couple', (coupleId) => { socket.join(coupleId); });
  socket.on('send_alert', (data) => {
    activeContexts.set(data.coupleId, { content: data.content, timestamp: Date.now() });
    io.to(data.coupleId).emit('receive_alert', data);
  });
});

app.post('/api/chat', async (req, res) => {
  const { coupleId, message } = req.body;
  const context = activeContexts.get(coupleId);
  const isValidContext = context && (Date.now() - context.timestamp < 1000 * 60 * 60 * 12);

  const kittyAIResponse = await getHelloKittyResponse(message, isValidContext ? context : null);

  if (kittyAIResponse) {
    if (isValidContext && (kittyAIResponse.includes("novio") || kittyAIResponse.includes("contó"))) {
       activeContexts.delete(coupleId);
    }
    return res.json({ response: kittyAIResponse });
  }

  res.json({ response: "¡Hola amiga! 🎀 Mi moño se enredó un poquito, pero cuéntame más. ✨" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de Hello Kitty activo en puerto ${PORT}`);
});
