import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

// 🟢 Cargar variables desde el archivo .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🟢 Obtener la clave desde variables de entorno
const OPENAI_API_KEY = "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";

app.post("/analizar", async (req, res) => {
  const { mensaje } = req.body;

  try {
    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // modelo moderno y rápido
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente médico que ayuda a detectar posibles enfermedades a partir de síntomas. Da respuestas claras, útiles y responsables. Haces pocas preguntas para orientar con responsabilidad. Solo hablas de salud. Si no es salud, di que solo estás relacionado con el tema de la salud. En psicología solo orientas en casos comunes; en otros casos, sugiere acudir a un profesional.",
          },
          {
            role: "user",
            content: mensaje,
          },
        ],
      }),
    });

    const data = await respuesta.json();
    console.log("📡 Respuesta IA:", JSON.stringify(data, null, 2));

    const texto =
      data.choices?.[0]?.message?.content ||
      "🤖 No se pudo analizar. Intenta de nuevo.";
    res.json({ respuesta: texto });
  } catch (error) {
    console.error("💥 Error en el servidor:", error);
    res.json({
      respuesta:
        "❌ Ocurrió un error al conectar con la IA. Verifica tu API key o conexión.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`)
);
