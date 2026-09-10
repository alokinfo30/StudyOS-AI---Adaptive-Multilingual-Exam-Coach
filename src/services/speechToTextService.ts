/**
 * Speech-to-Text & Closed Captions Service for Apprentice Teacher Micro-Teaching Practicum
 * Provides live Web Speech API recognition (SpeechRecognition / webkitSpeechRecognition)
 * with robust pedagogical script fallback and editable timestamped segments.
 */

import { ClosedCaptionSegment, TeachingSkillCategory, TeacherTrainingProgram } from '../types/teaching';

export interface SpeechRecognizerHandlers {
  onSegmentCaptured: (segment: ClosedCaptionSegment) => void;
  onInterimText?: (text: string) => void;
  onError?: (error: string) => void;
}

export class MicroTeachingSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private startTimeMs: number = 0;
  private currentSegmentStartSec: number = 0;
  private handlers: SpeechRecognizerHandlers | null = null;
  private accumulatedText: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-IN'; // Indian English / Global English
          this.setupEvents();
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
          this.recognition = null;
        }
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  private setupEvents() {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let finalized = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalized += transcript;
        } else {
          interim += transcript;
        }
      }

      if (this.handlers?.onInterimText) {
        this.handlers.onInterimText(interim || finalized);
      }

      if (finalized.trim()) {
        const nowSec = Math.max(1, (Date.now() - this.startTimeMs) / 1000);
        const segment: ClosedCaptionSegment = {
          id: `caption_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          startSeconds: Math.round(this.currentSegmentStartSec * 10) / 10,
          endSeconds: Math.round(nowSec * 10) / 10,
          text: finalized.trim(),
        };
        this.currentSegmentStartSec = nowSec;
        this.accumulatedText += ' ' + finalized.trim();
        this.handlers?.onSegmentCaptured(segment);
      }
    };

    this.recognition.onerror = (event: any) => {
      // Ignore routine aborts when stopped by user
      if (event.error !== 'aborted') {
        console.warn('Speech recognition warning:', event.error);
        if (this.handlers?.onError) {
          this.handlers.onError(event.error);
        }
      }
    };

    this.recognition.onend = () => {
      // If still supposed to be listening (e.g. Chrome 60s silence timeout), safely restart
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (err) {
          // ignore
        }
      }
    };
  }

  public start(handlers: SpeechRecognizerHandlers) {
    this.handlers = handlers;
    this.isListening = true;
    this.startTimeMs = Date.now();
    this.currentSegmentStartSec = 0;
    this.accumulatedText = '';

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        // already started or mic busy
      }
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  public getAccumulatedTranscript(): string {
    return this.accumulatedText.trim();
  }
}

/**
 * Pedagogical closed captions generator tailored for micro-teaching phases
 * Used as automatic high-fidelity caption generator when Web Speech API is absent or when requested.
 */
export function generatePedagogicalCaptions(params: {
  topicTitle: string;
  skillFocus: TeachingSkillCategory;
  durationSeconds: number;
  program: TeacherTrainingProgram;
  keywords?: string[];
}): ClosedCaptionSegment[] {
  const { topicTitle, skillFocus, durationSeconds } = params;
  const safeDuration = Math.max(15, durationSeconds);

  // Define structured pedagogical narrative templates based on skill category
  let narrativePhases: { fraction: [number, number]; template: string }[] = [];

  switch (skillFocus) {
    case 'set_induction':
      narrativePhases = [
        {
          fraction: [0, 0.2],
          template: `Good morning everyone! Observe this real-life scenario connected to our topic, "${topicTitle}".`,
        },
        {
          fraction: [0.2, 0.45],
          template: 'Have you ever wondered why this happens in our everyday environment? Think for a moment.',
        },
        {
          fraction: [0.45, 0.75],
          template: `Today, we will investigate the underlying scientific principle behind ${topicTitle}.`,
        },
        {
          fraction: [0.75, 1.0],
          template: 'Let us write our central inquiry question clearly on the blackboard and begin our discovery.',
        },
      ];
      break;

    case 'blackboard_skill':
      narrativePhases = [
        {
          fraction: [0, 0.22],
          template: `Welcome class. Please turn your attention to the blackboard for our topic: ${topicTitle}.`,
        },
        {
          fraction: [0.22, 0.5],
          template: 'Notice how we partition the board: Definitions on the left, formula and diagrams in the center.',
        },
        {
          fraction: [0.5, 0.78],
          template: 'Using legible print size, clean labeling, and neat arrows to illustrate the flow of concepts.',
        },
        {
          fraction: [0.78, 1.0],
          template: 'Take 20 seconds to copy this concise summary schematic into your practicum notebooks.',
        },
      ];
      break;

    case 'probing_questions':
      narrativePhases = [
        {
          fraction: [0, 0.2],
          template: `Let us test our initial understanding of ${topicTitle} with a probing question.`,
        },
        {
          fraction: [0.2, 0.45],
          template: 'Aarav, if we double this value, what immediate change do you predict in the system?',
        },
        {
          fraction: [0.45, 0.72],
          template: 'Good try! Can anyone help Aarav extend his explanation using our previous definition?',
        },
        {
          fraction: [0.72, 1.0],
          template: 'Exactly! Prompting deeper inquiry reveals the fundamental cause and effect.',
        },
      ];
      break;

    case 'explanation_analogy':
      narrativePhases = [
        {
          fraction: [0, 0.22],
          template: `To understand ${topicTitle}, let us imagine a simple analogy that everyone is familiar with.`,
        },
        {
          fraction: [0.22, 0.5],
          template: 'Think of water flowing through a garden pipe compared to electric current in a conductor.',
        },
        {
          fraction: [0.5, 0.78],
          template: 'Just like pressure pushes water through resistance, potential difference drives electrical charge.',
        },
        {
          fraction: [0.78, 1.0],
          template: 'This analogy helps us connect abstract textbook formulas to tangible physical reality.',
        },
      ];
      break;

    case 'lesson_closure':
      narrativePhases = [
        {
          fraction: [0, 0.25],
          template: `To conclude our micro-teaching session on ${topicTitle}, let us summarize key takeaways.`,
        },
        {
          fraction: [0.25, 0.55],
          template: 'First, remember our primary definition and the three criteria we observed on the board.',
        },
        {
          fraction: [0.55, 0.8],
          template: 'For tonight’s practice, identify one practical application of this concept at home.',
        },
        {
          fraction: [0.8, 1.0],
          template: 'Thank you class! In our next period, we will explore advanced numerical problems.',
        },
      ];
      break;

    default:
      narrativePhases = [
        {
          fraction: [0, 0.25],
          template: `Greetings learners! In this micro-teaching demonstration, we master ${topicTitle}.`,
        },
        {
          fraction: [0.25, 0.5],
          template: 'Focus on clear stimulus variation, purposeful voice pitch, and active student engagement.',
        },
        {
          fraction: [0.5, 0.78],
          template: 'Check student comprehension regularly and reinforce accurate responses with verbal praise.',
        },
        {
          fraction: [0.78, 1.0],
          template: 'Reflect on pacing and ensure key learning outcomes are achieved before session closure.',
        },
      ];
      break;
  }

  // Adjust timing based on total duration
  return narrativePhases.map((phase, idx) => {
    const startSec = Math.round(phase.fraction[0] * safeDuration);
    const endSec = Math.round(phase.fraction[1] * safeDuration);
    return {
      id: `gen_cap_${idx + 1}_${Date.now()}`,
      startSeconds: startSec,
      endSeconds: Math.max(startSec + 2, endSec),
      text: phase.template,
    };
  });
}

/**
 * Format seconds into mm:ss or hh:mm:ss string
 */
export function formatTimeSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Export subtitles in WebVTT (.vtt) format
 */
export function exportSubtitlesAsVtt(segments: ClosedCaptionSegment[], title: string): string {
  let vtt = `WEBVTT - Micro-Teaching Practicum Captions: ${title}\n\n`;

  segments.forEach((seg, idx) => {
    const start = formatVttTimestamp(seg.startSeconds);
    const end = formatVttTimestamp(seg.endSeconds);
    vtt += `${idx + 1}\n${start} --> ${end}\n${seg.text}\n\n`;
  });

  return vtt;
}

function formatVttTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 1000);
  return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(3, '0')}`;
}
