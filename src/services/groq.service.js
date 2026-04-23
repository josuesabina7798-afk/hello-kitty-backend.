const Groq = require("groq-sdk");

const getHelloKittyResponse = async (userMessage, hiddenContext = null) => {
  // Creamos el cliente aquí adentro para asegurar que ya cargaron las variables de entorno
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("No se encontró GROQ_API_KEY");
    return null;
  }

  const groq = new Groq({ apiKey });

  try {
    const systemPrompt = `Eres Hello Kitty, la mejor amiga de la usuaria. La tratas siempre de "amiga".
    Eres dulce, leal, divertida y te encanta platicar de cualquier tema (chismes, consejos, música, películas, juegos, amor).
    Si hay un aviso de su novio, debes decírselo directamente de forma dulce: "Amiga, ya me contó tu novio que...".
    Usa muchos emojis como 🎀✨♥ y frases encantadoras.
    Tu prioridad es su bienestar y que pase un rato divertido platicando contigo.
    Si te preguntan por sentimientos, usa los ejercicios de respiración o consejos tiernos.`;

    const messages = [{ role: "system", content: systemPrompt }];

    if (hiddenContext) {
      messages.push({ role: "system", content: `AVISO DEL NOVIO (Menciónalo en tu respuesta): ${hiddenContext.content}` });
    }

    messages.push({ role: "user", content: userMessage });

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 350,
    });

    return chatCompletion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error en Groq:", error.message);
    return null;
  }
};

module.exports = { getHelloKittyResponse };
