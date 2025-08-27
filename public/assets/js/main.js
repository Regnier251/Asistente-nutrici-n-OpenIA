//Seleccionar elementos del DOM
let userInput = document.querySelector("#inputText");
let resButton = document.querySelector("#resButton");
const chatBox = document.querySelector(".chat__messages");
const userId = "anon-" + Date.now();

function displayMessage(msgText, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat__message");
  msgDiv.classList.add(
    sender === "user" ? "chat__message--user" : "chat__message--bot"
  );

  if (sender == "bot") {
    msgDiv.classList.add("chat__message--ia");
  }
  msgDiv.textContent = msgText;

  chatBox.appendChild(msgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const myMessage = userInput.value;

  if (!myMessage) return false;

  userInput.value = "";

  //Añadir mi mensaje de usuario
  displayMessage(myMessage, "user");

  //Crear mensaje de carga
  displayMessage("Cargando...", "bot");

  try {
    const response = await fetch("http://localhost:3000/api/nutri-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        userMessage: myMessage,
      }),
    });

    let data;
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error("Respuesta no es JSON");
    }

    const botMessages = chatBox.querySelectorAll(".chat__message--ia");
    const lastBotMsg = botMessages[botMessages.length - 1];

    if (lastBotMsg) {

      //Formaterar tabla
      if (data.reply.length >= 100) {
        const md = new markdownit();
        const htmlContent = md.render(data.reply);
        lastBotMsg.innerHTML = htmlContent;
      } else{
        lastBotMsg.textContent = data.reply;
      }

      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      displayMessage(data.reply, "bot");
    }
  } catch (error) {
    const botMessages = chatBox.querySelectorAll(".chat__message--ia");
    const lastBotMsg = botMessages[botMessages.length - 1];
    if (lastBotMsg) {
      lastBotMsg.textContent =
        "Error: No se pudo obtener respuesta. Intenta nuevamente.";
    } else {
      displayMessage(
        "Error: No se pudo obtener respuesta. Intenta nuevamente.",
        "bot"
      );
    }
    console.error(error);
  }
}

function formaterarTable(reply) {}

resButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
