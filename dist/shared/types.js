"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechRecognitionEvent = exports.SpeechRecognition = void 0;
// The declare modifier informs TypeScript that these fields will exist at runtime, but the compiler does not need to verify their initialization.
class SpeechRecognition {
    start() { }
    stop() { }
}
exports.SpeechRecognition = SpeechRecognition;
class SpeechRecognitionEvent extends Event {
}
exports.SpeechRecognitionEvent = SpeechRecognitionEvent;
