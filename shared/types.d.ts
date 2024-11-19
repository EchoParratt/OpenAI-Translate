// Request body for translation endpoint
export interface TranslationRequestBody{
    text: string
    lang: string
}

export interface TranslationResponse{
    translation: string
}

// SpeechRecognition and SpeechRecognitionEvent declarations for TypeScript
declare class SpeechRecognition {
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start(): void;
    stop(): void;
}

declare class SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

declare global {
    interface Window {
        SpeechRecognition?: typeof SpeechRecognition;
        webkitSpeechRecognition?: typeof SpeechRecognition;
    }
}

export {};
