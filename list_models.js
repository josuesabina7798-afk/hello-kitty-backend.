const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await axios.get(url);
        console.log("--- MODELOS DISPONIBLES ---");
        response.data.models.forEach(m => {
            if(m.supportedGenerationMethods.includes("generateContent")) {
                console.log("- " + m.name);
            }
        });
    } catch (e) {
        console.log("❌ Error de red o clave inválida:", e.response ? e.response.data : e.message);
    }
}

listModels();
