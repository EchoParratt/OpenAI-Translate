// Check for support for SpeechRecognition or webkitSPeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecongnition;

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
            const translation = translateEng(englishPhrase)
        }
    }

async function translateEng(text) {
    try {
        const response = await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({text})
        });
        if (!response.ok){
            throw new Error(`Server request failed / Status : ${response.status}`)
        }
    }
    catch (error) {
        console.error("Error in translation process, pinpoint in translateEng function", error)
        alert("Error with translation request. Please try again")
        return "Translation failed";
    }
}