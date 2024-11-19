"use strict";
// A backend service for translating English text to other languages using OpenAI’s GPT-3.5-turbo model.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require('express'); // Used to set up server and handle HTTP requests
//const cors = require('cors'); // Allows frontend to communicate seamlessly with backend
//const dotenv =require('dotenv');
const OpenAI = require('openai'); // API Client
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Server Setup
const app = (0, express_1.default)();
const PORT = 5001;
dotenv_1.default.config();
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://127.0.0.1:5500', // only allows requests from
}));
app.use(express_1.default.json()); // For parsing incoming JSON payloads
// Serve static files from the dist/client directory
app.use(express_1.default.static(path_1.default.join(__dirname, "../client")));
// Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // from .env 
});
// Endpoint to handle translation requests
app.post('/translate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { text, lang } = req.body;
    const messages = [
        { role: 'system', content: `Translate the following English text to ${lang}` },
        { role: 'user', content: text }
    ];
    try {
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 100, // Limits response length to 100 tokens
        });
        // Logging for debugging
        console.log("Choices Array:", response.choices);
        console.log("First Choice Message Object:", (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message);
        // Access the translated text
        const translatedText = ((_c = (_b = response.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "Translation not available";
        res.json({ translation: translatedText });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error with OpenAI API:", error.message);
            res.status(500).json({ error: error.message });
        }
        else {
            console.error('Unkown error occured', error);
            res.status(500).json({ error: "An unkown Error has occured " });
        }
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running :3 on http://localhost:${PORT}`);
});
