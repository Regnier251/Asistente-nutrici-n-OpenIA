// Importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

//Cargar configuracion (api key)
dotenv.config();

//Cargar express
const app = express();
const PORT = process.env.PORT || 3000;

//Servir pagina estatica(frontend)
app.use("/",express.static("public"));

//Crear middleware para procesar JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Instancia de openai y pasar el apikey
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//Funcion para generar plan de dieta
const generateDietplan = async (userResponses) => {

    //Crear el prompt(sistema, indiaciones para la ia)
    const promptSystem = {
        role: "system",
        content: `Eres un nutricionista experto en crear planes de alimentación personalizados. Basándote en las respuestas del usuario, 
        genera un plan de dieta semanal equilibrado y saludable.
        El usuario solo puede  hacer preguntars relacionadas con la nutrición y dietas.
        
        El sistema no responderá a ninguna pregunta que no esté relacionada con la nutrición y dietas.`
    }

    //Crear el prompt del usuario
    const promptUser = {
        role: "user",
        content: `El usuario tiene las siguientes características:
        - Peso: ${userResponses.peso} kg
        - Estatura: ${userResponses.altura} cm
        - Objetivo: ${userResponses.objetivo}
        - Alergias o restricciones alimentarias: ${userResponses.alergias}
        - Alimentos que no le gustan: ${userResponses.no_gusta}.
        
        Devuelve la dieta en formato table markdown con los siguientes campos: Día, Comida, Almuerzo, Cena, Snacks y Calorias.
        Y no digas nada más, solo la tabla.`
    }

    //Llamar a la api de openai

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [promptSystem, promptUser],
            max_tokens: 1000,
            temperature: 0.75,
        });
        //Devolver la respuesta generada por openai
        const response = completion.choices[0].message.content;
        return response;
    } catch (error) {
        console.error("Error al generar el plan de dieta:", error);
        throw error;
    }
};

//Objeto con los datos del usuario
let userData = {};

//Ruta / endpoint / url
app.post("/api/nutri-chat", async (req, res) => {

    //Primero se pregunta por el peso(frontend)

    //Recibir datos del usuario
    const userId = req.body.id;
    const userMessage = req.body.userMessage;
    
    //Generar objeto del usuario si no existe
    if(!userData[userId]){
        userData[userId] = {};
    }

    if(!userData[userId].peso){
        userData[userId].peso = userMessage;

        return res.json({reply: "¿Cuál es tu estatura (cm)?"});
    }

    if(!userData[userId].altura){
        userData[userId].altura = userMessage;

        return res.json({reply: "¿Cuál es tu objetivo? (adelgazar, mantener, ganar músculo)"});

    }

    if(!userData[userId].objetivo){
        userData[userId].objetivo = userMessage;

        return res.json({reply: "Tienes alguna alergia o restricción alimentaria?"});

    }

    if(!userData[userId].alergias){
        userData[userId].alergias = userMessage;

        return res.json({reply: "¿Qué alimentos que no te gustan?"});

    }

    if(!userData[userId].no_gusta){
        userData[userId].no_gusta = userMessage;
        try {
            const diet = await generateDietplan(userData[userId]);
            return res.json({reply: `Aquí esta su dieta 🍎💪🥗 \n${diet}`});
        } catch (error) {
            return res.status(500).json({reply: "Hubo un error al generar el plan de dieta. Por favor, intenta nuevamente más tarde."});
        }
    }
    

    return res.json({reply: "Tu plan de alimentación semanal es: ... (aquí iría el plan generado por OpenAI)"});
    
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});