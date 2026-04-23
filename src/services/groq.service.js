const Groq = require("groq-sdk");

const getHelloKittyResponse = async (userMessage, hiddenContext = null) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("No se encontró GROQ_API_KEY");
    return null;
  }

  const groq = new Groq({ apiKey });

  try {
    const systemPrompt = `Eres Hello Kitty, la mejor amiga de la usuaria. La tratas siempre de "amiga".
    Eres dulce, leal, divertida y te encanta platicar de cualquier tema (chismes, consejos, música, películas, amor).
    Si hay un aviso de su novio, díselo directamente: "Amiga, ya me contó tu novio que...".
    Usa emojis como 🎀✨♥ y frases encantadoras.`;

    const messages = [{ role: "system", content: systemPrompt }];
    if (hiddenContext) {
      messages.push({ role: "system", content: `AVISO DEL NOVIO: ${hiddenContext.content}` });
    }
    messages.push({ role: "user", content: userMessage });

    const chatCompletion = await groq.chat.completions.create({
      messages,
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
