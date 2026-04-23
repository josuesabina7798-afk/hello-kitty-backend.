const { OpenAI } = require('openai');

const getHelloKittyResponse = async (userMessage, hiddenContext = null) => {
  if (!process.env.OPENAI_API_KEY) {
    return null; // Devolver null para que el servidor use respuestas predefinidas
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = `Eres Hello Kitty, la mejor amiga de esta persona. 
  Tu misión es apoyarla y cuidarla usando los avisos que te da su novio. 
  Debes tratarla siempre de "amiga". 
  Cuando recibas un aviso (hidden context), menciónalo directamente diciendo: "Amiga, ya me contó tu novio que...". 
  Sé dulce, leal y un poquito regañona si no se cuida bien, como una mejor amiga 🎀♥.
  Usa emojis y frases cortas.`;

  const messages = [
    { role: "system", content: systemPrompt },
  ];

  if (hiddenContext) {
    messages.push({ 
      role: "system", 
      content: `CONTEXTO INVISIBLE (ACTÚA SOBRE ESTO): El usuario tiene este aviso: ${hiddenContext.category} - ${hiddenContext.content}` 
    });
  }

  messages.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.8,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error en OpenAI Service:", error);
    return null;
  }
};

module.exports = { getHelloKittyResponse };
