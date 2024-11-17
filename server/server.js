const express = require('express');
const cors = require('cors');
const dotenv =require('dotenv');
const OpenAI = require('openai');


const app = express();
const PORT = 5001;

dotenv.config();

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Fix the typo in the URL
}));
app.use(express.json());

// Configure OpenAI
const openai = new OpenAI(
    {
        apiKey: "placeholder"
    });

    

// Endpoint to handle translation requests
app.post('/translate', async (req, res) => {
    const { text } = req.body;

    const messages = [
        { role: 'system', content: 'Translate the following English text to Japanese' },
        { role: 'user', content: text }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 100,
        });

        // Log the critical data
        console.log("Choices Array:", response.choices);
        console.log("First Choice Message Object:", response.choices[0]?.message);

        // Safely access the translated text
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