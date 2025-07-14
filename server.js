import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const OPENAI_API_KEY = "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"

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
        model: "gpt-4o-mini",  // modelo moderno y rápido
        messages: [
          {
            role: "system",
            content: "Eres un asistente médico que ayuda a detectar posibles enfermedades a partir de síntomas. Da respuestas claras, útiles y responsables.Asiendo pocas preguntas para orientar con responsabilidad, Solo relasionado con la salud en otro caso di que solo estas relasionado con el tema de la salud, solo orientas en casos de psicología solo casos comunes de lo contrario orienta a ir a un  psicologo",
          },
          {
            role: "user",
            content: mensaje,
          }
        ]
      }),
    });

    const data = await respuesta.json();
    console.log("📡 Respuesta IA:", JSON.stringify(data, null, 2));

    const texto = data.choices?.[0]?.message?.content || "🤖 No se pudo analizar. Intenta de nuevo.";
    res.json({ respuesta: texto });
  } catch (error) {
    console.error("💥 Error en el servidor:", error);
    res.json({ respuesta: "❌ Ocurrió un error al conectar con la IA. Verifica tu API key o conexión." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor iniciado en http://localhost:${PORT}`));
