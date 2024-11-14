const express = require('express');
const cors = require('cors');
const {Configuration, OpenAIApi} = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors())
app.use(express.json());

// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Endpoint to handle translation requests
app.post('/translate', async (req,res) => {
    const {text} = req.body;
    const messages = [
        {role: 'system', content: 'Translate the following English text to Japanese'},
        {role: 'user', content: text}
    ]
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });
    
    const translation = response.data.choices[0].message.content.trim();
    res.json({translation})
    } catch (error) {
        console.error("Error with OpenAI API", error);
        res.status(500).json({error: 'Translation Failed :('})

    }

});

app.listen(PORT, () => {
    console.log(`Server is running :3 on http://localhost:${PORT}`)
});