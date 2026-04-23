const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function checkGemini() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Usamos el modelo que listamos anteriormente como disponible
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

    try {
        console.log("Probando con Gemini 2.0 Flash...");
        const result = await model.generateContent("Di: ¡Hola amiga! Soy Hello Kitty inteligente 🎀");
        const response = await result.response;
        console.log("✅ ÉXITO:", response.text());
    } catch (e) {
        console.log("❌ ERROR:", e.message);
    }
}

checkGemini();
