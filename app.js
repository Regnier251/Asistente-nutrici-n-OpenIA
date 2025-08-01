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

//Ruta / endpoint / url
app.post("/api/traducir", async(req,res) => {
    const { text, targetLang } = req.body;
    const promptSystem1 = "Eres un traductor profesional.";
    const promptSystem2 = "Solo puedes responder con una traducción directa del texto que el usuario te envíe."
                            + "Cualquier otra respuesta o conversación está prohibida.";
    const promptUser = `Traduce el siguiente texto al ${targetLang}:${text}`;
    // Llamar al LLM o modurlo de openai

    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: promptSystem1},
                {role: "system", content: promptSystem2},
                {role: "user", content: promptUser}
            ],
            max_tokens:500,
            response_format: {type:"text"}
        });
        
        const translatedText = completion.choices[0].message.content;
        
        return res.status(200).json({translatedText});

    }catch(error){
        console.log(error)
        return res.status(500).json({error: "Error al traducir el texto}"});
    }

});
    

//Servir el backend
app.listen(PORT), () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}

