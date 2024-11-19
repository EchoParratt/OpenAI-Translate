var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Check for support for SpeechRecognition or webkitSpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// Declare recognition variable globally
let recognition = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set lang to English
}
// Checks to see if recognition was created successfully
if (recognition) {
    console.log('SpeechRecognition init was success');
    // Triggered when speech recognition captures input
    recognition.onresult = (event) => __awaiter(void 0, void 0, void 0, function* () {
        const englishPhrase = event.results[0][0].transcript;
        console.log("Input English Phrase:", englishPhrase);
        const lang = document.getElementById("lang").value; // Retrieves target language
        const translation = yield translateEng(englishPhrase, lang);
        speakTranslated(translation, lang);
    });
}
// Sends the recognized text and target language to a translation backend API
function translateEng(text, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestBody = { text, lang };
            const response = yield fetch("http://localhost:5001/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error(`Server request failed / Status : ${response.status}`);
            }
            const data = yield response.json();
            return data.translation;
        }
        catch (error) {
            console.error("Error in translation process, pinpoint in translateEng function", error);
            alert("Error with translation request. Please try again");
            return "Translation failed";
        }
    });
}
// Converts the translated text to speech
function speakTranslated(text, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
    });
}
// Button Interaction logic
function translateAndSpeak() {
    if (recognition) {
        recognition.start(); // This should trigger the permission prompt
    }
    else {
        console.error("Speech recognition is not initialized.");
    }
}
function stop() {
    if (recognition) {
        recognition.stop();
    }
    document.getElementById('TranslateButton').disabled = false;
}
// Event listeners for buttons
document.getElementById('TranslateButton').addEventListener('click', () => {
    document.getElementById('TranslateButton').disabled = true;
    translateAndSpeak();
});
document.getElementById('StopButton').addEventListener('click', stop);
export {};
