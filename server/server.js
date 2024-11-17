// A backend service for translating English text to other languages using OpenAI’s GPT-3.5-turbo model.

const express = require('express'); // Used to set up server and handle HTTP requests
const cors = require('cors'); // Allows frontend to communicate seamlessly with backend
const dotenv =require('dotenv');
const OpenAI = require('openai'); // API Client

// Server Setup
const app = express();
const PORT = 5001;
dotenv.config();

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // only allows requests from
}));
app.use(express.json()); // For parsing incoming JSON payloads

// Configure OpenAI
const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY // from .env 
    });

// Endpoint to handle translation requests
app.post('/translate', async (req, res) => {
    const { text, lang } = req.body;

    const messages = [
        { role: 'system', content: `Translate the following English text to ${lang}` },
        { role: 'user', content: text }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 100, // Limits response length to 100 tokens
        });

        // Logging for debugging
        console.log("Choices Array:", response.choices);
        console.log("First Choice Message Object:", response.choices[0]?.message);

        // Access the translated text
        const translatedText = response.choices[0]?.message?.content || "Translation not available";

        res.json({ translation: translatedText });
    } catch (error) {
        console.error("Error with OpenAI API:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running :3 on http://localhost:${PORT}`)
});