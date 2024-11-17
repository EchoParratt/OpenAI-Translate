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

        recognition.onresult = async (event) => {
            const englishPhrase = event.results[0][0].transcript
            console.log("Input English Phrase:", englishPhrase)
            const translation = await translateEng(englishPhrase)
            speakJapanese(translation)
        }
    }

async function translateEng(text) {
    try {
        const response = await fetch("http://localhost:5001/translate", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({text})
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

async function speakJapanese(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
}

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
}

// Event listeners for buttons
document.getElementById('TranslateButton').addEventListener('click', translateAndSpeak);
document.getElementById('StopButton').addEventListener('click', stop);
