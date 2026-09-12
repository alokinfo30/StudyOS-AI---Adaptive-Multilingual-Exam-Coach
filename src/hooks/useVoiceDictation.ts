import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseVoiceDictationOptions {
  language?: string; // 'en-IN' | 'en-US' | 'hi-IN'
  continuous?: boolean;
  onResult?: (finalText: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
}

export interface UseVoiceDictationReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  durationSeconds: number;
  startListening: (overrideLang?: string) => void;
  stopListening: () => void;
  toggleListening: (overrideLang?: string) => void;
  resetTranscript: () => void;
  setTranscript: (text: string) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}

export const DICTATION_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US / Global)' },
  { code: 'hi-IN', label: 'Hindi / Hinglish (भारत)' },
  { code: 'en-GB', label: 'English (UK)' },
];

export function useVoiceDictation(options: UseVoiceDictationOptions = {}): UseVoiceDictationReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [selectedLang, setSelectedLang] = useState(options.language || 'en-IN');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Check if browser supports Web Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsSupported(false);
      return;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass || typeof SpeechRecognitionClass !== 'function') {
        setIsSupported(false);
      }
    } catch {
      setIsSupported(false);
    }
  }, []);

  // Timer for active recording
  useEffect(() => {
    if (isListening) {
      setDurationSeconds(0);
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition', e);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(
    (overrideLang?: string) => {
      setError(null);
      setInterimTranscript('');

      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition || typeof SpeechRecognition !== 'function') {
        setError('Voice-to-text is not supported in this browser. Please type or use Chrome/Edge/Safari.');
        setIsSupported(false);
        if (options.onError) {
          options.onError('Voice-to-text not supported in this browser.');
        }
        return;
      }

      // Stop previous instance if running
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = options.continuous !== undefined ? options.continuous : true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = overrideLang || selectedLang || 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            const text = res[0]?.transcript || '';
            if (res.isFinal) {
              finalChunk += (finalChunk ? ' ' : '') + text;
            } else {
              currentInterim += (currentInterim ? ' ' : '') + text;
            }
          }

          if (finalChunk) {
            setTranscript((prev) => {
              const updated = prev ? `${prev.trim()} ${finalChunk.trim()}` : finalChunk.trim();
              if (options.onResult) {
                options.onResult(updated, true);
              }
              return updated;
            });
          }

          setInterimTranscript(currentInterim);
          if (currentInterim && options.onResult) {
            options.onResult(currentInterim, false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          } else if (event.error === 'no-speech') {
            // No speech detected, keep waiting or inform gracefully
            setError('No speech was detected. Speak clearly into the microphone.');
          } else if (event.error === 'network') {
            setError('Speech network connection issue. Check internet connectivity.');
          } else {
            setError(`Voice recognition status: ${event.error}`);
          }
          setIsListening(false);
          if (options.onError) {
            options.onError(event.error);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setError('Could not initialize microphone. Please check browser permissions.');
        setIsListening(false);
      }
    },
    [options, selectedLang]
  );

  const toggleListening = useCallback(
    (overrideLang?: string) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(overrideLang);
      }
    },
    [isListening, startListening, stopListening]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    durationSeconds,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    setTranscript,
    selectedLang,
    setSelectedLang,
  };
}
