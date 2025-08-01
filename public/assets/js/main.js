let translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async() => {

    let inputText = document.querySelector("#inputText");

    //valor a traducir
    const text = inputText.value.trim();

    //lenguaje de destino
    const targetLang = document.querySelector("#targetLang").value;

    if(!text) return false;

    //Meter el mensaje del usuario a la caja de mensajes
    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;

    const messagesContainer = document.querySelector(".chat__messages");
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrolTop = messagesContainer.scrollHeight;

    //Petición ajax al backend

    try {
        const response = await fetch("/api/traducir", {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                text,
                targetLang
            })
        });

        const data = await response.json();

        //Agregaré el mensaje de la IA al chat
        const botMessage = document.createElement("div");
        botMessage.className = "chat__message chat__message--bot";
        botMessage.textContent = data.translatedText;
        
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrolTop = messagesContainer.scrollHeight;


    } catch (error) {
        console.log("Error:",error); 
    }

    inputText.value = "";

    //Vasciar el input de tipo texto
})