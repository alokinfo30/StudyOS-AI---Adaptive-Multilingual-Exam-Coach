import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Trash2,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';
import { LanguageCode } from '../../types';

export interface ConceptVoiceMemoData {
  id: string;
  chapterId: string;
  conceptId: string;
  conceptTitle: string;
  audioDataUrl: string;
  durationSec: number;
  createdAt: number;
  mimeType: string;
}

interface ConceptVoiceMemoRecorderProps {
  chapterId: string;
  conceptId: string;
  conceptTitle: string;
  language: LanguageCode;
}

const MAX_RECORDING_SEC = 120; // 2 minutes max per voice memo

export const ConceptVoiceMemoRecorder: React.FC<ConceptVoiceMemoRecorderProps> = ({
  chapterId,
  conceptId,
  conceptTitle,
  language: _language,
}) => {
  const [memo, setMemo] = useState<ConceptVoiceMemoData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDurationSec, setRecordDurationSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [showFeynmanTips, setShowFeynmanTips] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const storageKey = `studyos_voice_memo_${chapterId}_${conceptId}`;

  // Load saved memo from localStorage when conceptId or chapterId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as ConceptVoiceMemoData;
        setMemo(parsed);
      } else {
        setMemo(null);
      }
    } catch (e) {
      console.warn('Failed to parse saved voice memo from localStorage', e);
      setMemo(null);
    }
    setErrorMessage(null);
  }, [storageKey]);

  // Check MediaRecorder and audio capture support on mount
  useEffect(() => {
    const hasMedia = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    const hasRecorder = typeof window !== 'undefined' && typeof (window as any).MediaRecorder !== 'undefined';
    setIsSupported(hasMedia && hasRecorder);
  }, []);

  // Clean up recording stream & timer on unmount or concept switch
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, [conceptId]);

  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleStartRecording = async () => {
    setErrorMessage(null);
    if (!isSupported) {
      setErrorMessage('Audio recording is not supported in this browser or environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        // Convert Blob to Base64 dataURL for localStorage storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64DataUrl = reader.result as string;
          const newMemo: ConceptVoiceMemoData = {
            id: `memo_${Date.now()}`,
            chapterId,
            conceptId,
            conceptTitle,
            audioDataUrl: base64DataUrl,
            durationSec: recordDurationSec,
            createdAt: Date.now(),
            mimeType: audioBlob.type || 'audio/webm',
          };

          try {
            localStorage.setItem(storageKey, JSON.stringify(newMemo));
            setMemo(newMemo);
          } catch (storageErr) {
            console.error('Failed to store voice memo to localStorage (exceeded quota?)', storageErr);
            setErrorMessage('Unable to save memo: localStorage space limit exceeded.');
          }
        };
        reader.readAsDataURL(audioBlob);

        // Turn off mic stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      recorder.start(250); // Collect slices every 250ms
      setIsRecording(true);
      setRecordDurationSec(0);

      // Start elapsed timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordDurationSec((prev) => {
          if (prev + 1 >= MAX_RECORDING_SEC) {
            handleStopRecording();
            return MAX_RECORDING_SEC;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions to record your voice memo.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('No microphone input device was detected on your computer or mobile device.');
      } else {
        setErrorMessage(`Recording failed: ${err.message || 'Unknown audio error'}`);
      }
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping mediaRecorder', err);
      }
    }
    setIsRecording(false);
  };

  const handleDeleteMemo = () => {
    try {
      localStorage.removeItem(storageKey);
      setMemo(null);
      setErrorMessage(null);
    } catch (e) {
      console.warn('Error deleting memo from localStorage', e);
    }
  };

  const handleDownloadMemo = () => {
    if (!memo?.audioDataUrl) return;
    const a = document.createElement('a');
    a.href = memo.audioDataUrl;
    const cleanTitle = conceptTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `StudyOS_${cleanTitle}_VoiceNote.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatRecordedDate = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg transition-all">
      {/* Header & Feynman Technique Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mic className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Concept Voice Memo</span>
              {memo && (
                <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  Saved locally
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Record a short vocal summary in your own words (Feynman Technique). Replay anytime to reinforce memory retention.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFeynmanTips((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 font-medium self-start sm:self-center transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showFeynmanTips ? 'Hide Tips' : 'Feynman Tip'}</span>
        </button>
      </div>

      {/* Expandable Feynman Explanation Prompt */}
      {showFeynmanTips && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 space-y-2 animate-fadeIn">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How to Record an Effective Concept Voice Memo:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-300 text-[11px] leading-relaxed">
            <li><strong>Keep it under 60-90 seconds:</strong> State the core rule or formula clearly.</li>
            <li><strong>Explain as if teaching a classmate:</strong> Avoid textbook jargon where simple words work better.</li>
            <li><strong>Mention one common exam trap:</strong> Identify where students lose marks on this topic.</li>
          </ul>
        </div>
      )}

      {/* Error display if mic permission or storage fails */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording in progress view */}
      {isRecording ? (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500" />
              </span>
              <span className="text-xs font-bold text-rose-300 font-mono tracking-wide">
                RECORDING IN PROGRESS...
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 font-bold bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
              <span className="text-rose-400">{formatSeconds(recordDurationSec)}</span>
              <span className="text-zinc-500">/ {formatSeconds(MAX_RECORDING_SEC)}</span>
            </div>
          </div>

          {/* Pulsing Audio Visualizer Wave */}
          <div className="flex items-center justify-center gap-1 h-8 px-4 bg-zinc-900/80 rounded-lg border border-zinc-800/60 overflow-hidden">
            {[40, 70, 95, 60, 30, 85, 100, 50, 75, 45, 90, 65, 35, 80, 55, 95, 70, 40].map((height, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full transition-all duration-150 animate-pulse"
                style={{
                  height: `${Math.max(15, (height * (1 + Math.sin(recordDurationSec * 4 + i))) / 2)}%`,
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-zinc-950 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20"
            >
              <Square className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Stop & Save to Local Storage</span>
            </button>
          </div>
        </div>
      ) : memo ? (
        /* Saved Memo view with native browser audio player */
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3.5 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                🎙️ Memo for: {memo.conceptTitle || conceptTitle}
              </span>
              <span className="text-zinc-500 text-[11px] font-mono">
                {formatRecordedDate(memo.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadMemo}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                title="Download voice memo audio (.webm)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDeleteMemo}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                title="Delete voice memo from local storage"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Native Browser Audio Player */}
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 shadow-inner">
            <audio
              ref={audioElementRef}
              controls
              src={memo.audioDataUrl}
              className="w-full h-10 accent-amber-500"
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-zinc-400 font-mono">
              Duration: {formatSeconds(memo.durationSec)} • Stored in browser local storage
            </span>

            <button
              type="button"
              onClick={handleStartRecording}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Re-record Voice Memo</span>
            </button>
          </div>
        </div>
      ) : (
        /* Ready to record state */
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-dashed border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-zinc-200">
              No voice memo recorded for this concept yet
            </div>
            <p className="text-[11px] text-zinc-400 max-w-md">
              Tap the record button to capture your personal 30-90 second explanation. You can replay it whenever revising!
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartRecording}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 shrink-0"
          >
            <Mic className="w-4 h-4" />
            <span>Record Voice Memo</span>
          </button>
        </div>
      )}
    </div>
  );
};
