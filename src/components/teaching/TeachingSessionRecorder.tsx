import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Scissors,
  RotateCcw,
  CheckCircle2,
  UploadCloud,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  ChevronRight,
  Info,
  AlertCircle,
  Eye,
  Camera,
  HelpCircle,
  Save,
  FolderOpen,
  Check,
  Zap,
  Repeat,
  Subtitles,
} from 'lucide-react';
import {
  TeachingTake,
  TeachingSkillCategory,
  TeacherTrainingProgram,
  TeachingSessionDraft,
  VideoVisualFilter,
  ClosedCaptionSegment,
  LoopPracticeTakeComparison,
  PrivacyAccessConfig,
} from '../../types/teaching';
import { playMasteryPopSound } from '../../utils/audioEffects';
import { saveTeachingDraft } from '../../services/teachingStorageService';
import {
  MicroTeachingSpeechRecognizer,
  generatePedagogicalCaptions,
} from '../../services/speechToTextService';
import { VisualTrimRangeSlider } from './VisualTrimRangeSlider';
import { AudioLightingQualityMonitor } from './AudioLightingQualityMonitor';
import { TeachingRecorderTutorialModal } from './TeachingRecorderTutorialModal';
import { VideoEffectsMenu, getCssFilterString } from './VideoEffectsMenu';
import { ClosedCaptionsEditor } from './ClosedCaptionsEditor';
import { LoopPracticeComparisonModal } from './LoopPracticeComparisonModal';
import { TeachingPrivacyTaggingPanel } from './TeachingPrivacyTaggingPanel';

interface TeachingSessionRecorderProps {
  skillFocus: TeachingSkillCategory;
  program: TeacherTrainingProgram;
  topicTitle: string;
  onSaveTake: (take: TeachingTake) => void;
  onPublishTake?: (take: TeachingTake) => void;
  existingTakesCount: number;
  initialDraft?: TeachingSessionDraft | null;
  onOpenDrafts?: () => void;
}

export const TeachingSessionRecorder: React.FC<TeachingSessionRecorderProps> = ({
  skillFocus,
  program,
  topicTitle,
  onSaveTake,
  onPublishTake,
  existingTakesCount,
  initialDraft,
  onOpenDrafts,
}) => {
  // Mode: 'live' (camera preview & recording) | 'review' (playback & trimming)
  const [recorderMode, setRecorderMode] = useState<'live' | 'review'>('live');

  // Video Effects state
  const [selectedFilter, setSelectedFilter] = useState<VideoVisualFilter>('none');

  // Closed Captions & Speech-to-Text state
  const [closedCaptions, setClosedCaptions] = useState<ClosedCaptionSegment[]>([]);
  const [showCaptionsOverlay, setShowCaptionsOverlay] = useState(true);
  const [interimSpeechText, setInterimSpeechText] = useState('');
  const speechRecognizerRef = useRef<MicroTeachingSpeechRecognizer | null>(null);

  // Quick Reset Toast
  const [quickResetToast, setQuickResetToast] = useState(false);

  // Loop Practice (30-second drills) state
  const [isLoopPracticeEnabled, setIsLoopPracticeEnabled] = useState(false);
  const isLoopPracticeRef = useRef(false);
  isLoopPracticeRef.current = isLoopPracticeEnabled;
  const [loopPracticeTakes, setLoopPracticeTakes] = useState<LoopPracticeTakeComparison[]>([]);
  const [isLoopModalOpen, setIsLoopModalOpen] = useState(false);

  // Tutorial modal & draft notification state
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Auto-open tutorial for novices if not dismissed before
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('studyos_recorder_tutorial_dismissed');
      if (!dismissed) {
        setIsTutorialOpen(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Initialize Speech Recognizer
  useEffect(() => {
    speechRecognizerRef.current = new MicroTeachingSpeechRecognizer();
    return () => {
      speechRecognizerRef.current?.stop();
    };
  }, []);

  // Pre-load draft session if provided
  useEffect(() => {
    if (initialDraft && initialDraft.take) {
      setCurrentTake(initialDraft.take);
      setRawDurationSeconds(
        initialDraft.rawDurationSeconds || initialDraft.take.durationSeconds || 60
      );
      if (initialDraft.trimRange) {
        setTrimStartSeconds(initialDraft.trimRange.startSeconds);
        setTrimEndSeconds(initialDraft.trimRange.endSeconds);
        setIsTrimmingActive(true);
      }
      if (initialDraft.take.closedCaptions) {
        setClosedCaptions(initialDraft.take.closedCaptions);
      }
      if (initialDraft.take.visualFilter) {
        setSelectedFilter(initialDraft.take.visualFilter);
      }
      if (initialDraft.privacyConfig) {
        setPrivacyConfig(initialDraft.privacyConfig);
      } else if (initialDraft.take?.privacyConfig) {
        setPrivacyConfig(initialDraft.take.privacyConfig);
      }
      if (initialDraft.topicTags && initialDraft.topicTags.length > 0) {
        setTopicTags(initialDraft.topicTags);
      } else if (initialDraft.take?.topicTags && initialDraft.take.topicTags.length > 0) {
        setTopicTags(initialDraft.take.topicTags);
      }
      setRecorderMode('review');
    }
  }, [initialDraft]);

  // Granular Privacy Settings & Topic Tagging
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyAccessConfig>(() => {
    if (initialDraft?.privacyConfig) return initialDraft.privacyConfig;
    if (initialDraft?.take?.privacyConfig) return initialDraft.take.privacyConfig;
    return {
      privacy: 'public',
      allowedPeerNames: ['Dr. S. K. Mishra (Supervisor)', 'Priya Singh (B.Ed Colleague)'],
      targetGroup: 'Supervisor & Peer Review Cohort',
    };
  });

  const [topicTags, setTopicTags] = useState<string[]>(() => {
    if (initialDraft?.topicTags && initialDraft.topicTags.length > 0) return initialDraft.topicTags;
    if (initialDraft?.take?.topicTags && initialDraft.take.topicTags.length > 0) return initialDraft.take.topicTags;
    const initialPrimary = topicTitle.toLowerCase().includes('physic') || topicTitle.toLowerCase().includes('buoy')
      ? 'Physics'
      : topicTitle.toLowerCase().includes('math') || topicTitle.toLowerCase().includes('fraction')
      ? 'Algebra'
      : topicTitle.toLowerCase().includes('electr') || topicTitle.toLowerCase().includes('ohm')
      ? 'Electrician'
      : 'Pedagogy';
    return [initialPrimary, 'Pedagogy', 'Classroom Practice'];
  });

  const handleUpdatePrivacy = (config: PrivacyAccessConfig) => {
    setPrivacyConfig(config);
    if (currentTake) {
      const updated = { ...currentTake, privacyConfig: config };
      setCurrentTake(updated);
      onSaveTake(updated);
    }
  };

  const handleUpdateTopicTags = (tags: string[]) => {
    setTopicTags(tags);
    if (currentTake) {
      const updated = { ...currentTake, topicTags: tags };
      setCurrentTake(updated);
      onSaveTake(updated);
    }
  };

  // MediaRecorder & Stream state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Practice Duration Management (Countdown & Elapsed Time)
  const [targetDurationSeconds, setTargetDurationSeconds] = useState<number>(180); // 3-minute default micro-teaching slot

  // Recorded Blob & URL
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Trimming State
  const [trimStartSeconds, setTrimStartSeconds] = useState(0);
  const [trimEndSeconds, setTrimEndSeconds] = useState(60);
  const [rawDurationSeconds, setRawDurationSeconds] = useState(60);
  const [isTrimmingActive, setIsTrimmingActive] = useState(false);
  const [previewTrimOnly, setPreviewTrimOnly] = useState(false);

  // Review Player State
  const [reviewCurrentTime, setReviewCurrentTime] = useState(0);
  const [isReviewPlaying, setIsReviewPlaying] = useState(false);
  const [isReviewMuted, setIsReviewMuted] = useState(false);

  // Current Take Data
  const [currentTake, setCurrentTake] = useState<TeachingTake | null>(null);

  // Refs
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const reviewVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Audio level simulation during live preview
  const [audioLevel, setAudioLevel] = useState(0);

  // Initialize Camera & Mic with MediaDevices
  const initMediaStream = async () => {
    try {
      setMediaError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });

      streamRef.current = stream;
      setHasCameraPermission(true);

      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('MediaRecorder getUserMedia error or permission denied:', err);
      setHasCameraPermission(false);
      setMediaError(
        'Camera/Mic unavailable or blocked. Interactive Practicum Simulation is active.'
      );
    }
  };

  useEffect(() => {
    initMediaStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Audio visualizer loop
  useEffect(() => {
    let interval: any = null;
    if (isRecording && micEnabled) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(20 + Math.random() * 80));
      }, 150);
    } else {
      setAudioLevel(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, micEnabled]);

  // Start MediaRecorder & Speech-to-Text
  const handleStartRecording = () => {
    recordedChunksRef.current = [];
    setRecordingSeconds(0);
    setMediaError(null);
    setInterimSpeechText('');

    // Start live speech-to-text recognition if mic is active
    if (micEnabled && speechRecognizerRef.current?.isSupported()) {
      try {
        speechRecognizerRef.current.start({
          onSegmentCaptured: (seg) => {
            setClosedCaptions((prev) => [...prev, seg]);
          },
          onInterimText: (text) => {
            setInterimSpeechText(text);
          },
          onError: (err) => {
            console.warn('Speech recognizer error:', err);
          },
        });
      } catch (e) {
        console.warn('Speech recognizer start error:', e);
      }
    }

    try {
      if (streamRef.current && streamRef.current.active) {
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

        const recorder = new MediaRecorder(streamRef.current, {
          mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        });

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedBlob(blob);
          setRecordedVideoUrl(url);

          const finalDuration = recordingSeconds || (isLoopPracticeRef.current ? 30 : 45);
          setRawDurationSeconds(finalDuration);
          setTrimStartSeconds(0);
          setTrimEndSeconds(finalDuration);

          finalizeTake(url, finalDuration);
        };

        mediaRecorderRef.current = recorder;
        recorder.start(1000); // 1-second chunks
      } else {
        // Fallback simulation recording for sandboxed or camera-restricted containers
        console.info('Using simulated recording session');
      }

      setIsRecording(true);
      setIsPaused(false);

      // Start elapsed timer with loop practice auto-stop at 30 seconds
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          // Auto-stop precisely at 30 seconds if Loop Practice drill is active
          if (isLoopPracticeRef.current && next >= 30) {
            setTimeout(() => {
              handleStopRecording();
            }, 0);
          }
          return next;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Failed to start MediaRecorder:', err);
      // Still proceed with simulated recording
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (isLoopPracticeRef.current && next >= 30) {
            setTimeout(() => {
              handleStopRecording();
            }, 0);
          }
          return next;
        });
      }, 1000);
    }
  };

  // Stop MediaRecorder & transition to review/trim mode
  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    // Stop speech recognition
    speechRecognizerRef.current?.stop();
    setInterimSpeechText('');

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    } else {
      // If simulated fallback without real MediaRecorder
      const duration = recordingSeconds || (isLoopPracticeRef.current ? 30 : 50);
      setRawDurationSeconds(duration);
      setTrimStartSeconds(0);
      setTrimEndSeconds(duration);
      finalizeTake(undefined, duration);
    }

    setRecorderMode('review');
    playMasteryPopSound(true);
  };

  // Quick Reset: Instantly discard current take and restart recording from 0s without opening menus
  const handleQuickReset = () => {
    // 1. Clear intervals
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // 2. Abort media recorder safely
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      } catch (err) {
        // ignore
      }
    }

    // 3. Stop speech recognizer & clear buffers
    speechRecognizerRef.current?.stop();
    setInterimSpeechText('');
    setClosedCaptions([]);
    recordedChunksRef.current = [];

    // 4. Reset timer & switch to live mode
    setRecordingSeconds(0);
    setRecorderMode('live');

    // 5. Trigger snappy sound & toast
    setQuickResetToast(true);
    setTimeout(() => setQuickResetToast(false), 3000);
    playMasteryPopSound();

    // 6. Restart recording timer fresh immediately
    setTimeout(() => {
      handleStartRecording();
    }, 150);
  };

  // Construct Take data
  const finalizeTake = (videoUrl?: string, duration: number = 50) => {
    const takeNum = existingTakesCount + 1;
    const speechPace = Math.floor(118 + Math.random() * 12); // 118-130 WPM
    const clarity = Math.floor(90 + Math.random() * 8); // 90-98%
    const modulation = Math.floor(88 + Math.random() * 10);
    const engagement = Math.floor(91 + Math.random() * 7);

    // Auto-generate pedagogical captions if no live microphone text was transcribed
    let finalCaptions = closedCaptions;
    if (finalCaptions.length === 0) {
      finalCaptions = generatePedagogicalCaptions({
        topicTitle,
        skillFocus,
        durationSeconds: duration,
        program,
      });
      setClosedCaptions(finalCaptions);
    }

    const take: TeachingTake = {
      id: `take_${Date.now()}`,
      takeNumber: takeNum,
      durationSeconds: duration,
      recordedAt: Date.now(),
      videoBlobUrl: videoUrl,
      speechPaceWpm: speechPace,
      clarityScore: clarity,
      voiceModulationScore: modulation,
      studentEngagementScore: engagement,
      detectedPedagogicalKeywords: [
        'Set Induction',
        'Inquiry Hook',
        'Blackboard Notation',
        'Student Probing',
        'Concept Clarity',
      ],
      rubricSelfRatings: {
        setInduction: 9,
        blackboardWork: 9,
        explanationClarity: 9,
        probingQuestions: 8,
        bodyLanguage: 9,
        lessonClosure: 8,
      },
      aiFeedback: {
        strengths: [
          'High energy opening with clear stimulus variation in voice pitch.',
          'Pacing matches NCERT/NCTE micro-teaching standards (120 WPM).',
          'Clean blackboard diagram layout with distinct sections for formulas.',
        ],
        improvements: [
          'Trim unnecessary silence at the very start to keep the campus reel snappy.',
          'Ensure summary recap is highlighted within the final 10 seconds.',
        ],
        pedagogicalTip:
          'Trimming the opening 3-5 seconds of setup and trailing pause will significantly boost peer engagement in the campus reel feed.',
      },
      virtualStudentInteractions: [
        {
          studentName: 'Aarav (Class 9)',
          question: 'Does this principle apply to floating ships in salt water?',
          resolved: true,
        },
      ],
      isBestTake: true,
      trimRange: {
        startSeconds: 0,
        endSeconds: duration,
      },
      isTrimmed: false,
      closedCaptions: finalCaptions,
      visualFilter: selectedFilter,
      isLoopPracticeTake: isLoopPracticeEnabled,
      privacyConfig: privacyConfig,
      topicTags: topicTags,
    };

    setCurrentTake(take);
    onSaveTake(take);

    // If Loop Practice drill is active, record comparison matrix entry
    if (isLoopPracticeEnabled) {
      const loopComparison: LoopPracticeTakeComparison = {
        takeId: take.id,
        takeNumber: loopPracticeTakes.length + 1,
        recordedAt: Date.now(),
        durationSeconds: Math.min(30, duration),
        speechPaceWpm: speechPace,
        clarityScore: clarity,
        voiceModulationScore: modulation,
        keywordsCoveredCount: take.detectedPedagogicalKeywords.length,
        pedagogicalKeywords: take.detectedPedagogicalKeywords,
        sampleTranscriptSnippet:
          finalCaptions[0]?.text || `30s focused drill on ${topicTitle}`,
        isBestLoopTake:
          loopPracticeTakes.length === 0 ||
          clarity >= Math.max(...loopPracticeTakes.map((t) => t.clarityScore), 0),
      };

      setLoopPracticeTakes((prev) => [...prev, loopComparison]);
      setIsLoopModalOpen(true);
    }
  };

  // Apply Trim
  const handleApplyTrim = () => {
    if (!currentTake) return;
    const trimmedDuration = Math.max(5, trimEndSeconds - trimStartSeconds);

    // Adjust caption segments to trimmed time window
    const adjustedCaptions = closedCaptions
      .filter((c) => c.endSeconds > trimStartSeconds && c.startSeconds < trimEndSeconds)
      .map((c) => ({
        ...c,
        startSeconds: Math.max(0, Math.round((c.startSeconds - trimStartSeconds) * 10) / 10),
        endSeconds: Math.min(trimmedDuration, Math.round((c.endSeconds - trimStartSeconds) * 10) / 10),
      }));

    const finalCaptions = adjustedCaptions.length > 0 ? adjustedCaptions : closedCaptions;

    const updatedTake: TeachingTake = {
      ...currentTake,
      durationSeconds: trimmedDuration,
      trimRange: {
        startSeconds: trimStartSeconds,
        endSeconds: trimEndSeconds,
      },
      isTrimmed: true,
      closedCaptions: finalCaptions,
      visualFilter: selectedFilter,
    };

    setCurrentTake(updatedTake);
    setClosedCaptions(finalCaptions);
    onSaveTake(updatedTake);
    setIsTrimmingActive(false);
    playMasteryPopSound(true);
  };

  // Review Player Controls
  const toggleReviewPlay = () => {
    if (reviewVideoRef.current) {
      if (isReviewPlaying) {
        reviewVideoRef.current.pause();
        setIsReviewPlaying(false);
      } else {
        if (reviewCurrentTime >= trimEndSeconds) {
          reviewVideoRef.current.currentTime = trimStartSeconds;
        }
        reviewVideoRef.current.play();
        setIsReviewPlaying(true);
      }
    } else {
      setIsReviewPlaying((prev) => !prev);
    }
  };

  // Review simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isReviewPlaying && !recordedVideoUrl) {
      interval = setInterval(() => {
        setReviewCurrentTime((prev) => {
          const next = prev + 1;
          if (next > (previewTrimOnly ? trimEndSeconds : rawDurationSeconds)) {
            return previewTrimOnly ? trimStartSeconds : 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReviewPlaying, recordedVideoUrl, previewTrimOnly, trimStartSeconds, trimEndSeconds, rawDurationSeconds]);

  // Video timeupdate handler
  const handleVideoTimeUpdate = () => {
    if (reviewVideoRef.current) {
      const curr = reviewVideoRef.current.currentTime;
      setReviewCurrentTime(curr);

      if (previewTrimOnly && curr >= trimEndSeconds) {
        reviewVideoRef.current.currentTime = trimStartSeconds;
      }
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const trimmedDuration = Math.max(0, trimEndSeconds - trimStartSeconds);

  // Countdown and Elapsed Time Calculations
  const elapsedSeconds = recordingSeconds;
  const countdownSeconds = Math.max(0, targetDurationSeconds - recordingSeconds);
  const isOvertime = recordingSeconds > targetDurationSeconds;
  const overtimeSeconds = Math.max(0, recordingSeconds - targetDurationSeconds);
  const pacingProgressPercent = Math.min(
    100,
    Math.round((recordingSeconds / targetDurationSeconds) * 100)
  );

  // Micro-teaching pacing phase guide
  const getPacingPhase = () => {
    if (!isRecording) return 'Standby • Select Target Duration & Practice';
    if (isOvertime) return 'Overtime • Wrap Up Lesson Promptly';
    const ratio = recordingSeconds / targetDurationSeconds;
    if (ratio < 0.25) return 'Phase 1: Set Induction & Attention Hook';
    if (ratio < 0.75) return 'Phase 2: Concept Presentation & Board Work';
    return 'Phase 3: Probing Questions & Lesson Closure';
  };

  const handleSaveAsDraft = () => {
    const takeToSave: TeachingTake = currentTake
      ? {
          ...currentTake,
          closedCaptions: closedCaptions.length > 0 ? closedCaptions : currentTake.closedCaptions,
          visualFilter: selectedFilter,
          trimRange: {
            startSeconds: trimStartSeconds,
            endSeconds: trimEndSeconds,
          },
          isTrimmed: isTrimmingActive,
          durationSeconds: trimmedDuration || currentTake.durationSeconds,
        }
      : {
          id: `take_${Date.now()}`,
          takeNumber: existingTakesCount + 1,
          durationSeconds: trimmedDuration || 90,
          recordedAt: Date.now(),
          speechPaceWpm: 124,
          clarityScore: 90,
          voiceModulationScore: 88,
          studentEngagementScore: 89,
          detectedPedagogicalKeywords: [topicTitle, skillFocus.replace('_', ' ')],
          rubricSelfRatings: {
            setInduction: 8,
            blackboardWork: 8,
            explanationClarity: 8,
            probingQuestions: 8,
            bodyLanguage: 8,
            lessonClosure: 8,
          },
          aiFeedback: {
            strengths: ['Clear pedagogical articulation', 'Consistent vocal projection'],
            improvements: ['Check trim markers to snip trailing pauses'],
            pedagogicalTip: 'Draft saved. You can continue fine-tuning the trim handles before publishing.',
          },
          isBestTake: true,
          trimRange: {
            startSeconds: trimStartSeconds,
            endSeconds: trimEndSeconds,
          },
          isTrimmed: isTrimmingActive,
          closedCaptions: closedCaptions,
          visualFilter: selectedFilter,
        };

    const draft: TeachingSessionDraft = {
      id: initialDraft?.id || `draft_${Date.now()}`,
      userId: 'current_trainee',
      topicTitle,
      subject: 'Micro-Teaching Practicum',
      targetClass: 'Target Grade Level',
      program,
      skillFocus,
      lessonObjectives: `Practice session for ${skillFocus.replace('_', ' ')} with precision trimming.`,
      blackboardKeyNotes: ['Core formula/concept', 'Active learning prompt', 'Closing recap'],
      take: {
        ...takeToSave,
        privacyConfig,
        topicTags,
      },
      rawDurationSeconds,
      trimRange: {
        startSeconds: trimStartSeconds,
        endSeconds: trimEndSeconds,
      },
      isTrimmed: isTrimmingActive,
      lightingQualityScore: 90,
      audioQualityScore: 94,
      speechPaceWpm: 124,
      savedAt: initialDraft?.savedAt || Date.now(),
      updatedAt: Date.now(),
      notes: initialDraft?.notes || 'Saved draft from Practicum Studio. Review or resume anytime.',
      privacyConfig,
      topicTags,
    };

    saveTeachingDraft(draft, 'current_trainee');
    playMasteryPopSound();
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 4000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Recorder Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Teaching Session Studio Recorder
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                MediaRecorder API
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Record live video/audio, review your delivery, and trim the best segment before campus publishing
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Tools */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Video Effects Menu */}
          <VideoEffectsMenu
            selectedFilter={selectedFilter}
            onSelectFilter={(filter) => {
              setSelectedFilter(filter);
              if (currentTake) {
                const updated = { ...currentTake, visualFilter: filter };
                setCurrentTake(updated);
                onSaveTake(updated);
              }
            }}
          />

          {/* Loop Practice Toggle (30s Drill) */}
          <button
            type="button"
            onClick={() => {
              const next = !isLoopPracticeEnabled;
              setIsLoopPracticeEnabled(next);
              if (next) {
                setTargetDurationSeconds(30);
              } else {
                setTargetDurationSeconds(180);
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
              isLoopPracticeEnabled
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
            title="Loop Practice: Record multiple 30s segments to compare pace, clarity & delivery"
          >
            <Repeat className={`w-3.5 h-3.5 ${isLoopPracticeEnabled ? 'animate-spin' : ''}`} />
            <span>Loop Practice (30s)</span>
            {isLoopPracticeEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping" />
            )}
          </button>

          {/* Loop Comparison Modal Trigger */}
          {loopPracticeTakes.length > 0 && (
            <button
              type="button"
              onClick={() => setIsLoopModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Compare all 30s loop practice takes"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Compare Takes ({loopPracticeTakes.length})</span>
            </button>
          )}

          {/* Quick Reset Button (Instant restart from 0s) */}
          <button
            type="button"
            onClick={handleQuickReset}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            title="Quick Reset: Discard current take and restart recording timer immediately"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Quick Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTutorialOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
            title="Novice Tutorial: Lighting, Audio & Trim Slider Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Tutorial</span>
          </button>

          {onOpenDrafts && (
            <button
              type="button"
              onClick={onOpenDrafts}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold transition flex items-center gap-1.5"
              title="Open Saved Teaching Drafts"
            >
              <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Drafts</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setRecorderMode('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                recorderMode === 'live'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Record Live</span>
            </button>
            <button
              type="button"
              disabled={!currentTake}
              onClick={() => setRecorderMode('review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                recorderMode === 'review'
                  ? 'bg-amber-500 text-zinc-950'
                  : !currentTake
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Review & Trim {currentTake ? `(Take ${currentTake.takeNumber})` : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK RESET TOAST */}
      {quickResetToast && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-200 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
            <span className="font-semibold">
              Quick Reset Activated: Discarded active take and restarted recording timer fresh from 0s!
            </span>
          </div>
        </div>
      )}

      {/* DRAFT SAVED TOAST */}
      {draftSavedToast && (
        <div className="p-3 bg-teal-500/15 border border-teal-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs text-teal-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Teaching session saved to Drafts! You can trim, practice more takes, or publish anytime.</span>
          </div>
          {onOpenDrafts && (
            <button
              type="button"
              onClick={onOpenDrafts}
              className="text-xs font-bold text-teal-300 underline hover:text-teal-100 shrink-0"
            >
              View Drafts
            </button>
          )}
        </div>
      )}

      {/* MEDIA ERROR / PERMISSION NOTICE */}
      {mediaError && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-amber-300">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{mediaError}</span>
        </div>
      )}

      {/* MODE 1: LIVE RECORDING STAGE */}
      {recorderMode === 'live' && (
        <div className="space-y-4">
          {/* Granular Privacy & Topic Tagging Controls */}
          <TeachingPrivacyTaggingPanel
            privacyConfig={privacyConfig}
            onChangePrivacy={handleUpdatePrivacy}
            topicTags={topicTags}
            onUpdateTags={handleUpdateTopicTags}
            compact={true}
          />

          <div className="relative aspect-video max-h-[460px] w-full bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col items-center justify-center group">
            {/* Live Camera Feed */}
            {hasCameraPermission && cameraEnabled ? (
              <video
                ref={liveVideoRef}
                autoPlay
                playsInline
                muted
                style={{ filter: getCssFilterString(selectedFilter) }}
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              /* Simulated Studio Visualizer */
              <div
                style={{ filter: getCssFilterString(selectedFilter) }}
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                  👩‍🏫
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{topicTitle}</h4>
                  <p className="text-xs text-zinc-400">
                    Skill: {skillFocus.replace('_', ' ')} • {program.toUpperCase()} Practicum Stage
                  </p>
                </div>
                {/* Audio Waveform simulation */}
                <div className="flex items-center gap-1 h-8">
                  {[20, 45, 30, 60, 40, 75, 50, 65, 35, 80, 25, 55, 30].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: isRecording ? `${Math.max(6, (h * audioLevel) / 100)}px` : '6px',
                      }}
                      className="w-1.5 bg-amber-400/80 rounded-full transition-all duration-150"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Overlaid Recording Status Header with Countdown & Elapsed Time */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {isRecording ? (
                  <>
                    {/* Live Rec & Elapsed Time */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/95 text-white text-xs font-bold shadow-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      <span>REC</span>
                      <span className="opacity-60">•</span>
                      <span className="font-mono">{formatTime(elapsedSeconds)} Elapsed</span>
                    </div>

                    {/* Countdown Remaining Timer */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md transition-all ${
                        isOvertime
                          ? 'bg-rose-500/90 text-white animate-pulse border border-rose-400'
                          : countdownSeconds <= 30
                          ? 'bg-amber-500/90 text-zinc-950 border border-amber-300 animate-pulse'
                          : 'bg-emerald-600/90 text-white border border-emerald-400/40'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono">
                        {isOvertime
                          ? `+${formatTime(overtimeSeconds)} Overtime!`
                          : `${formatTime(countdownSeconds)} Remaining`}
                      </span>
                    </div>

                    {/* Phase Badge */}
                    <div className="hidden md:flex items-center px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-amber-300 border border-white/10 font-medium">
                      {getPacingPhase()}
                    </div>

                    {/* Loop Practice Drill Indicator */}
                    {isLoopPracticeEnabled && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-zinc-950 text-xs font-extrabold shadow-lg">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>30s Loop Drill</span>
                      </div>
                    )}

                    {/* Overlaid Quick Reset Button */}
                    <button
                      type="button"
                      onClick={handleQuickReset}
                      className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/50 text-xs font-bold shadow-lg backdrop-blur-md transition-all active:scale-95"
                      title="Quick Reset: Discard this take and restart recording timer immediately from 0s"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>Quick Reset</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 text-xs font-medium border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Standby • Target: {formatTime(targetDurationSeconds)}</span>
                  </div>
                )}
              </div>

              {/* Hardware Toggles */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setCameraEnabled((prev) => !prev)}
                  className={`p-2 rounded-xl backdrop-blur-md transition ${
                    cameraEnabled ? 'bg-black/60 text-white' : 'bg-rose-500 text-white'
                  }`}
                  title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMicEnabled((prev) => !prev)}
                  className={`p-2 rounded-xl backdrop-blur-md transition ${
                    micEnabled ? 'bg-black/60 text-white' : 'bg-rose-500 text-white'
                  }`}
                  title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Speech-to-Text Transcription Overlay */}
            {isRecording && (interimSpeechText || closedCaptions.length > 0) && (
              <div className="absolute bottom-16 inset-x-4 flex justify-center pointer-events-none z-20">
                <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/40 text-center max-w-lg shadow-2xl animate-fadeIn">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-amber-400 font-mono mb-0.5">
                    <Subtitles className="w-3 h-3" />
                    <span>Speech-to-Text Live Transcript</span>
                  </div>
                  <p className="text-xs text-white font-medium italic truncate">
                    &quot;{interimSpeechText || closedCaptions[closedCaptions.length - 1]?.text}&quot;
                  </p>
                </div>
              </div>
            )}

            {/* Smartboard Outline Overlay */}
            <div className="absolute bottom-4 left-4 max-w-sm pointer-events-none hidden sm:block">
              <div className="bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-left space-y-1">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Live Lesson Goal
                </div>
                <div className="text-xs text-white font-semibold truncate">{topicTitle}</div>
              </div>
            </div>
          </div>

          {/* Live Real-Time Audio & Lighting Quality Monitor Indicator */}
          <AudioLightingQualityMonitor
            liveVideoRef={liveVideoRef}
            streamRef={streamRef}
            isRecording={isRecording}
            micEnabled={micEnabled}
          />

          {/* Recording Control & Pacing Bar */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
            {/* Live Progress Bar when recording */}
            {isRecording && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="text-amber-300 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{getPacingPhase()}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono">
                    <span>
                      Elapsed: <strong className="text-white">{formatTime(elapsedSeconds)}</strong>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span>
                      Countdown:{' '}
                      <strong
                        className={
                          isOvertime
                            ? 'text-rose-400'
                            : countdownSeconds <= 30
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {formatTime(countdownSeconds)}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    style={{ width: `${pacingProgressPercent}%` }}
                    className={`h-full transition-all duration-300 ${
                      isOvertime
                        ? 'bg-rose-500'
                        : countdownSeconds <= 30
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-rose-600/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-white" />
                    <span>Start Recording (Take {existingTakesCount + 1})</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-rose-500/40 font-bold text-sm tracking-wide transition shadow-lg"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop & Review Recording</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickReset}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold text-sm tracking-wide transition shadow-lg active:scale-95"
                      title="Quick Reset: Discard this take and restart recording immediately"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span>Quick Reset</span>
                    </button>
                  </div>
                )}

                {/* Target Duration Selector (available in Standby) */}
                {!isRecording && (
                  <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-xl border border-zinc-800">
                    <span className="text-[11px] text-zinc-400 px-1 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Target:</span>
                    </span>
                    {[
                      { sec: 60, label: '1m' },
                      { sec: 120, label: '2m' },
                      { sec: 180, label: '3m (Std)' },
                      { sec: 300, label: '5m' },
                      { sec: 360, label: '6m' },
                    ].map((slot) => (
                      <button
                        key={slot.sec}
                        type="button"
                        onClick={() => setTargetDurationSeconds(slot.sec)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          targetDurationSeconds === slot.sec
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-zinc-400 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Target: {formatTime(targetDurationSeconds)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>NCTE Micro-Teaching Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: REVIEW & TRIMMING STAGE */}
      {recorderMode === 'review' && currentTake && (
        <div className="space-y-6 animate-in fade-in">
          {/* Review Video Player */}
          <div className="relative aspect-video max-h-[460px] w-full bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col items-center justify-center">
            {recordedVideoUrl ? (
              <video
                ref={reviewVideoRef}
                src={recordedVideoUrl}
                playsInline
                muted={isReviewMuted}
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={() => setIsReviewPlaying(false)}
                style={{ filter: getCssFilterString(selectedFilter) }}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Simulation Review Player */
              <div
                style={{ filter: getCssFilterString(selectedFilter) }}
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-2xl shadow-xl">
                  👩‍🏫
                </div>
                <h4 className="text-sm font-bold text-white">
                  Take #{currentTake.takeNumber} Playback Review
                </h4>
                <div className="text-xs text-amber-300 font-mono">
                  {formatTime(reviewCurrentTime)} / {formatTime(rawDurationSeconds)}
                </div>
                <div className="flex items-center gap-1 h-6">
                  {[12, 24, 18, 30, 22, 28, 16, 26, 14, 20].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: isReviewPlaying ? `${h}px` : '4px' }}
                      className="w-1.5 bg-amber-400/70 rounded-full transition-all duration-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Closed Captions Overlay on Video */}
            {showCaptionsOverlay && (() => {
              const activeCaption = closedCaptions.find(
                (c) => reviewCurrentTime >= c.startSeconds && reviewCurrentTime <= c.endSeconds
              );
              if (!activeCaption) return null;
              return (
                <div className="absolute bottom-12 inset-x-4 flex justify-center pointer-events-none z-30 animate-fadeIn">
                  <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-amber-500/40 shadow-2xl max-w-xl">
                    <p className="text-xs sm:text-sm font-semibold text-amber-200 drop-shadow">
                      {activeCaption.text}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      [{formatTime(activeCaption.startSeconds)} - {formatTime(activeCaption.endSeconds)}]
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Play / Pause Centered Action Indicator */}
            <button
              type="button"
              onClick={toggleReviewPlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition group"
            >
              <div className="w-14 h-14 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                {isReviewPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </div>
            </button>

            {/* Top Info Bar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
                  Take #{currentTake.takeNumber} Review Mode
                </span>
                {selectedFilter !== 'none' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30 capitalize">
                    {selectedFilter} filter
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setShowCaptionsOverlay((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-md transition flex items-center gap-1.5 ${
                    showCaptionsOverlay
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'bg-black/60 text-zinc-400 hover:text-white'
                  }`}
                  title={showCaptionsOverlay ? 'Hide Closed Captions Overlay' : 'Show Closed Captions Overlay'}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>CC {showCaptionsOverlay ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReviewMuted((prev) => !prev)}
                  className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md pointer-events-auto hover:bg-black/80 transition"
                >
                  {isReviewMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Pre-Finalization Studio Quality Audit Indicator */}
          <AudioLightingQualityMonitor
            liveVideoRef={liveVideoRef}
            streamRef={streamRef}
            isRecording={false}
            micEnabled={micEnabled}
            isReviewMode={true}
          />

          {/* TRIMMING CONTROLLER INTERFACE */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Session Trimmer & Segment Optimizer
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-zinc-400">
                  Original: <strong className="text-zinc-200">{formatTime(rawDurationSeconds)}</strong>
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-amber-300 font-bold">
                  Trimmed Output: {formatTime(trimmedDuration)}
                </span>
              </div>
            </div>

            {/* Visual Dual-Handle Range Slider */}
            <div className="space-y-3">
              <VisualTrimRangeSlider
                rawDuration={rawDurationSeconds}
                trimStart={trimStartSeconds}
                trimEnd={trimEndSeconds}
                currentTime={reviewCurrentTime}
                onTrimChange={(newStart, newEnd, seekTo) => {
                  setTrimStartSeconds(newStart);
                  setTrimEndSeconds(newEnd);
                  if (seekTo !== undefined) {
                    setReviewCurrentTime(seekTo);
                    if (reviewVideoRef.current) {
                      reviewVideoRef.current.currentTime = seekTo;
                    }
                  }
                }}
                onSeek={(time) => {
                  setReviewCurrentTime(time);
                  if (reviewVideoRef.current) {
                    reviewVideoRef.current.currentTime = time;
                  }
                }}
                formatTime={formatTime}
              />

              {/* Quick Trim Preset Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[11px] text-zinc-500">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrimStartSeconds(Math.min(5, rawDurationSeconds - 10));
                    setTrimEndSeconds(rawDurationSeconds);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500"
                >
                  Trim First 5s
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrimStartSeconds(0);
                    setTrimEndSeconds(Math.max(10, rawDurationSeconds - 5));
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500"
                >
                  Trim Last 5s
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrimStartSeconds(0);
                    setTrimEndSeconds(rawDurationSeconds);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  Reset to Full
                </button>
                <label className="ml-auto flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={previewTrimOnly}
                    onChange={(e) => setPreviewTrimOnly(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Loop Only Trimmed Window</span>
                </label>
              </div>
            </div>

            {/* Trimming Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-850">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyTrim}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Trimmed Segment ({formatTime(trimmedDuration)})</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-md shadow-teal-600/20"
                  title="Save partially recorded session to local drafts"
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecorderMode('live')}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold transition"
                >
                  Record Another Take
                </button>

                {onPublishTake && (
                  <button
                    type="button"
                    onClick={() => onPublishTake(currentTake)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/30"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Publish Best Take to Campus</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Granular Privacy & Topic Tagging Panel for Review & Finalization */}
          <TeachingPrivacyTaggingPanel
            privacyConfig={privacyConfig}
            onChangePrivacy={handleUpdatePrivacy}
            topicTags={topicTags}
            onUpdateTags={handleUpdateTopicTags}
            compact={false}
          />

          {/* CLOSED CAPTIONS / SPEECH-TO-TEXT REVIEW & EDITOR */}
          <ClosedCaptionsEditor
            captions={closedCaptions}
            videoDurationSeconds={trimmedDuration || rawDurationSeconds}
            currentTime={reviewCurrentTime}
            onSeek={(sec) => {
              setReviewCurrentTime(sec);
              if (reviewVideoRef.current) {
                reviewVideoRef.current.currentTime = sec;
              }
            }}
            onChangeCaptions={(updated) => {
              setClosedCaptions(updated);
              if (currentTake) {
                const updatedTake = { ...currentTake, closedCaptions: updated };
                setCurrentTake(updatedTake);
                onSaveTake(updatedTake);
              }
            }}
            topicTitle={topicTitle}
            skillFocus={skillFocus}
            program={program}
            showOverlay={showCaptionsOverlay}
            onToggleOverlay={() => setShowCaptionsOverlay((prev) => !prev)}
          />
        </div>
      )}

      {/* Loop Practice Multi-Take Comparison Modal */}
      <LoopPracticeComparisonModal
        isOpen={isLoopModalOpen}
        onClose={() => setIsLoopModalOpen(false)}
        topicTitle={topicTitle}
        skillFocus={skillFocus}
        takes={loopPracticeTakes}
        onSelectBestTake={(takeId) => {
          setLoopPracticeTakes((prev) =>
            prev.map((t) => ({ ...t, isBestLoopTake: t.takeId === takeId }))
          );
          playMasteryPopSound(true);
        }}
        onRecordAnotherTake={() => {
          setIsLoopModalOpen(false);
          setRecorderMode('live');
          setTimeout(() => {
            handleStartRecording();
          }, 200);
        }}
      />

      {/* Guided Tutorial Overlay for Novices */}
      <TeachingRecorderTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onOpenDrafts={onOpenDrafts}
      />
    </div>
  );
};
