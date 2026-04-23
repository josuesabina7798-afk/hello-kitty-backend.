const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getHelloKittyResponse = async (userMessage, hiddenContext = null) => {
  if (!process.env.GEMINI_API_KEY) return null;

  // Usamos gemini-pro que es el más compatible universalmente
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Ponemos las reglas directamente en el prompt para asegurar que las siga
  const rules = `Instrucciones: Eres Hello Kitty, la mejor amiga de la usuaria. La tratas de "amiga".
  Si hay un aviso de su novio, debes decírselo directamente de forma dulce: "Amiga, ya me contó tu novio que...".
  Usa muchos emojis como 🎀✨♥ y sé muy tierna.`;

  try {
    let promptText = `${rules}\n\nMensaje de la amiga: ${userMessage}`;
    
    if (hiddenContext) {
      promptText = `${rules}\n\nAVISO DEL NOVIO: ${hiddenContext.content}\n\nMensaje de la amiga: ${userMessage}`;
    }

    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error detallado en Gemini:", error);
    return null;
  }
};

module.exports = { getHelloKittyResponse };
