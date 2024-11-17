// This script integrates Web Speech API for speech recognition, fetches translations from server.js
// and uses Speech Synthesis API to read the translated text out loud.

// Check for support for SpeechRecognition or webkitSpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Declare recognition variable globally
let recognition;

if(SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US' // Set lang to English
}
    // Checks to see if recognition was created successfully
    if(recognition) {
        console.log('SpeechRecognition init was success')
        // Triggered when speech recognition captures input
        recognition.onresult = async (event) => {
            const englishPhrase = event.results[0][0].transcript
            console.log("Input English Phrase:", englishPhrase)
            const lang = document.getElementById("lang").value; // Retrieves target language
            const translation = await translateEng(englishPhrase, lang) 
            speakTranslated(translation,lang)
        }
    }
// Sends the recognized text and target language to a translation backend API
async function translateEng(text, lang) {
    try {
        const response = await fetch("http://localhost:5001/translate", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({text, lang})
        });

        if (!response.ok){
            throw new Error(`Server request failed / Status : ${response.status}`)
        }
        const data = await response.json()
        return data.translation
    }
    catch (error) {
        console.error("Error in translation process, pinpoint in translateEng function", error)
        alert("Error with translation request. Please try again")
        return "Translation failed";
    }

}

// Converts the translated text to speech
async function speakTranslated(text,lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

// Button Interaction logic
function translateAndSpeak() { 
    if (recognition) {
        recognition.start(); // This should trigger the permission prompt
    } else {
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
