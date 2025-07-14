const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

function agregarMensaje(texto, clase) {
  const msg = document.createElement("div");
  msg.className = "message " + clase;
  msg.innerText = texto;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;

  agregarMensaje(texto, "user");
  input.value = "";

  agregarMensaje("⏳ Pensando...", "bot");

  const res = await fetch("/analizar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mensaje: texto }),
  });

  const data = await res.json();
  const respuesta = data.respuesta;

  chat.lastChild.innerText = "🤖 " + respuesta;

  // 🔊 Verificamos si el interruptor de voz está activado
  const lecturaActivada = document.getElementById("vozToggle");
  if (lecturaActivada && lecturaActivada.checked) {
    const utterance = new SpeechSynthesisUtterance(respuesta);
    utterance.lang = "es-ES";
    speechSynthesis.speak(utterance);
  }
}
