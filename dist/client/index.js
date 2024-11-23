// client/index.ts
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = null;
var englishPhrase = "";
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
}
if (recognition) {
  console.log("SpeechRecognition init was success");
  recognition.onresult = async (event) => {
    englishPhrase = event.results[0][0].transcript;
    const lang = document.getElementById("lang").value;
    const translation = await translateEng(englishPhrase, lang);
    speakTranslated(translation, lang);
  };
}
async function translateEng(text, lang) {
  try {
    const requestBody = { text, lang };
    const response = await fetch("http://localhost:5001/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`Server request failed / Status : ${response.status}`);
    }
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error("Error in translation process, pinpoint in translateEng function", error);
    alert("Error with translation request. Please try again");
    return "Translation failed";
  }
}
async function speakTranslated(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const translationContainer = document.getElementById("translationContainer");
  const inputTextContainer = document.getElementById("inputTextContainer");
  if (translationContainer && inputTextContainer) {
    textOutput(text, translationContainer);
    textOutputEng(englishPhrase, inputTextContainer);
  } else {
    console.error("Translation container not found!");
  }
  speechSynthesis.speak(utterance);
  stopLoading();
}
function textOutput(text, container, speed = 50) {
  let index = 0;
  container.textContent = "";
  console.log("textOutputEng called with text:", text);
  const type = () => {
    if (index < text.length) {
      container.textContent += text[index];
      index++;
      setTimeout(type, speed);
    }
  };
  type();
}
function textOutputEng(text, container, speed = 50) {
  let index = 0;
  container.textContent = "";
  const type = () => {
    if (index < text.length) {
      container.textContent += text[index];
      index++;
      setTimeout(type, speed);
    }
  };
  type();
}
function translateAndSpeak() {
  if (recognition) {
    recognition.start();
  } else {
    console.error("Speech recognition is not initialized.");
  }
}
function stop() {
  if (recognition) {
    recognition.stop();
  }
  document.getElementById("TranslateButton").disabled = false;
  stopLoading();
}
document.getElementById("TranslateButton").addEventListener("click", () => {
  document.getElementById("TranslateButton").disabled = true;
  startLoading();
  translateAndSpeak();
});
document.getElementById("StopButton").addEventListener("click", stop);
var loader = document.querySelector(".loader");
var startLoading = () => {
  if (loader) {
    loader.classList.remove("hidden");
  }
};
var stopLoading = () => {
  if (loader) {
    loader.classList.add("hidden");
  }
};
