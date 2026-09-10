import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  School,
  GraduationCap,
  BookOpen,
  Award,
} from 'lucide-react';
import {
  TeacherTrainingProgram,
  TeachingReelPost,
  TeachingSkillCategory,
  TeachingTake,
  UserModerationRecord,
  PrivacyAccessConfig,
} from '../../types/teaching';
import { checkContentModeration } from '../../services/moderationService';
import { CommunityConductModal, CommunityConductToast } from './CommunityConductModal';
import { TeachingPrivacyTaggingPanel } from './TeachingPrivacyTaggingPanel';

interface CampusPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestTake?: TeachingTake;
  allTakesCount: number;
  moderationRecord: UserModerationRecord;
  onPublish: (post: TeachingReelPost) => void;
  onFlagViolation: (blockedText: string, words: string[]) => void;
  onTriggerDisclaimer: () => void;
}

const POPULAR_CAMPUSES = [
  'District Institute of Education & Training (DIET), Lucknow',
  'Govt Central Pedagogical Institute, Allahabad / Prayagraj',
  'National Institute of Teacher Training (NITT), New Delhi',
  'National Skill Training Institute (NSTI), Kanpur (ITI CITS)',
  'Central Institute of Education (CIE), University of Delhi',
  'Govt Teachers Training College, Varanasi',
  'State Council of Educational Research & Training (SCERT) Campus',
];

export const CampusPublishModal: React.FC<CampusPublishModalProps> = ({
  isOpen,
  onClose,
  bestTake,
  allTakesCount,
  moderationRecord,
  onPublish,
  onFlagViolation,
  onTriggerDisclaimer,
}) => {
  const [traineeName, setTraineeName] = useState('Ananya Sharma');
  const [traineeProgram, setTraineeProgram] = useState<TeacherTrainingProgram>('b_ed');
  const [traineeYear, setTraineeYear] = useState('B.Ed 2nd Year Intern');
  const [collegeCampus, setCollegeCampus] = useState(POPULAR_CAMPUSES[0]);
  const [customCampus, setCustomCampus] = useState('');
  const [subject, setSubject] = useState('Science • Physics');
  const [topicTitle, setTopicTitle] = useState("Archimedes' Principle & Buoyancy in Daily Life");
  const [targetClass, setTargetClass] = useState('Class 9');
  const [skillFocus, setSkillFocus] = useState<TeachingSkillCategory>('set_induction');
  const [lessonObjectives, setLessonObjectives] = useState(
    'Introduce fluid displacement through a simple demonstration; guide students to discover buoyant force.'
  );
  const [blackboardNotes, setBlackboardNotes] = useState(
    '1. Buoyant Force (Fb) upwards\n2. Object Floats if Density < Liquid\n3. Object Sinks if Density > Liquid'
  );
  const [pledgeRespect, setPledgeRespect] = useState(false);
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyAccessConfig>(
    () =>
      bestTake?.privacyConfig || {
        privacy: 'public',
        allowedPeerNames: ['Dr. S. K. Mishra (Supervisor)', 'Priya Singh (B.Ed Colleague)'],
        targetGroup: 'Supervisor & Peer Review Cohort',
      }
  );
  const [topicTags, setTopicTags] = useState<string[]>(
    () =>
      bestTake?.topicTags && bestTake.topicTags.length > 0
        ? bestTake.topicTags
        : ['Physics', 'Pedagogy', 'Set Induction']
  );

  // Community Conduct Pre-Submission Verification Modal State
  const [pendingPost, setPendingPost] = useState<TeachingReelPost | null>(null);
  const [isConductModalOpen, setIsConductModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (moderationRecord.isBanned) return;

    if (!moderationRecord.disclaimerAccepted) {
      onTriggerDisclaimer();
      return;
    }

    // Verify content against abuse/inappropriate language
    const combinedContent = `${topicTitle} ${lessonObjectives} ${blackboardNotes}`;
    const modResult = checkContentModeration(combinedContent);
    if (!modResult.isSafe) {
      onFlagViolation(combinedContent, modResult.flaggedWords);
      return;
    }

    const finalCampus = customCampus.trim() || collegeCampus;
    const cleanObjectives = lessonObjectives
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const cleanBlackboard = blackboardNotes
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const newPost: TeachingReelPost = {
      id: `reel_${Date.now()}`,
      traineeId: moderationRecord.userId || `trainee_${Date.now()}`,
      traineeName: traineeName.trim() || 'Student Teacher',
      traineeAvatar:
        traineeProgram === 'iti_trainer'
          ? '👨‍🔧'
          : traineeProgram === 'btc_deled'
          ? '👩‍🏫'
          : '👩‍🏫',
      traineeProgram,
      traineeYear,
      collegeCampus: finalCampus,
      campusCity: finalCampus.includes('Lucknow')
        ? 'Lucknow, UP'
        : finalCampus.includes('Kanpur')
        ? 'Kanpur, UP'
        : finalCampus.includes('Delhi')
        ? 'New Delhi'
        : 'Campus City',
      subject: subject.trim(),
      topicTitle: topicTitle.trim(),
      targetClass,
      skillFocus,
      lessonObjectives: cleanObjectives.length > 0 ? cleanObjectives : ['Promote conceptual understanding.'],
      blackboardKeyNotes: cleanBlackboard.length > 0 ? cleanBlackboard : ['Core concepts summarized.'],
      durationSeconds: bestTake?.durationSeconds || 150,
      videoBlobUrl: bestTake?.videoBlobUrl,
      simulationStyle:
        traineeProgram === 'iti_trainer'
          ? 'iti_workshop'
          : subject.toLowerCase().includes('math')
          ? 'math_board'
          : 'interactive_classroom',
      likesCount: 1,
      applauseCount: 1,
      viewsCount: 12,
      sharesCount: 0,
      createdAt: Date.now(),
      bestTakeStats: {
        speechPaceWpm: bestTake?.speechPaceWpm || 120,
        clarityScore: bestTake?.clarityScore || 90,
        takesCount: allTakesCount || 1,
      },
      rubricAverages: {
        setInduction: 9.0,
        blackboardWork: 8.8,
        explanationClarity: 9.0,
        probingQuestions: 8.9,
        voiceAndBodyLanguage: 9.0,
        lessonClosure: 8.8,
        overallAverage: 8.9,
        totalEvaluationsCount: 1,
      },
      evaluations: [
        {
          id: `eval_init_${Date.now()}`,
          evaluatorId: 'ai_supervisor',
          evaluatorName: 'AI Practicum Pedagogical Supervisor',
          evaluatorRole: 'certified_judge',
          evaluatorDesignation: 'Automated Micro-Teaching Benchmark',
          evaluatorAvatar: '🤖',
          evaluatorCollege: finalCampus,
          rubricScores: {
            setInduction: 9,
            blackboardWork: 9,
            explanationClarity: 9,
            probingQuestions: 9,
            voiceAndBodyLanguage: 9,
            lessonClosure: 9,
          },
          overallScore: 9.0,
          qualitativeFeedback:
            'Well-sequenced micro-teaching session with balanced pacing, active student interaction, and clear concept summary.',
          timestamp: Date.now(),
        },
      ],
      comments: [
        {
          id: `comm_welcome_${Date.now()}`,
          authorId: 'system_bot',
          authorName: 'Campus Practicum Coordinator',
          authorAvatar: '🏛️',
          authorRole: 'college_teacher',
          authorCollege: finalCampus,
          text: `Welcome ${traineeName} to the Campus Micro-Teaching Feed! Trainees and supervisors can now judge your session rubrics.`,
          timestamp: Date.now(),
          likes: 2,
          isConstructiveFeedback: true,
        },
      ],
      closedCaptions: bestTake?.closedCaptions,
      visualFilter: bestTake?.visualFilter,
      privacyConfig: privacyConfig,
      topicTags: topicTags,
    };

    // Stage post and trigger Community Conduct Modal
    setPendingPost(newPost);
    setIsConductModalOpen(true);
  };

  const handleConfirmConduct = () => {
    if (!pendingPost) return;
    onPublish(pendingPost);
    setIsConductModalOpen(false);
    setToastMessage(
      `Community Conduct Verified: "${pendingPost.topicTitle}" published to campus reels with active AI moderation.`
    );
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div
        className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-zinc-100 relative my-6 max-h-[92vh] flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Publish Best Take to Campus Reels
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Take #{bestTake?.takeNumber || 1} Selected
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Share among your college colleagues, professors, and external judges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 py-4 pr-1">
          {/* Program & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Training Program / Qualification
              </label>
              <select
                value={traineeProgram}
                onChange={(e) => {
                  const prog = e.target.value as TeacherTrainingProgram;
                  setTraineeProgram(prog);
                  if (prog === 'b_ed') setTraineeYear('B.Ed 2nd Year Intern');
                  else if (prog === 'btc_deled') setTraineeYear('BTC / D.El.Ed Practicum Phase');
                  else if (prog === 'iti_trainer') setTraineeYear('CITS Apprentice Technical Trainer');
                }}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="b_ed">👩‍🏫 B.Ed (Bachelor of Education)</option>
                <option value="btc_deled">🎒 BTC / D.El.Ed (Elementary Education)</option>
                <option value="iti_trainer">👨‍🔧 ITI Craft Instructor (CITS / NCVT)</option>
                <option value="ntt">🧸 NTT (Nursery Teacher Training)</option>
                <option value="m_ed">🎓 M.Ed (Master of Education)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Trainee Name & Year
              </label>
              <input
                type="text"
                required
                value={traineeName}
                onChange={(e) => setTraineeName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* College Campus */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1 flex items-center justify-between">
              <span>College Campus / Training Institute</span>
              <span className="text-[11px] text-amber-400 font-normal">Broadcasts to this college feed</span>
            </label>
            <select
              value={collegeCampus}
              onChange={(e) => setCollegeCampus(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500 mb-2"
            >
              {POPULAR_CAMPUSES.map((campus, idx) => (
                <option key={idx} value={campus}>
                  {campus}
                </option>
              ))}
              <option value="custom">Other / Custom College Campus...</option>
            </select>
            {collegeCampus === 'custom' && (
              <input
                type="text"
                value={customCampus}
                onChange={(e) => setCustomCampus(e.target.value)}
                placeholder="Enter your College / DIET name and City"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            )}
          </div>

          {/* Subject, Topic & Skill Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Science • Physics"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Target Class</label>
              <input
                type="text"
                required
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                placeholder="e.g. Class 9 / ITI 1st Yr"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Micro-Teaching Skill</label>
              <select
                value={skillFocus}
                onChange={(e) => setSkillFocus(e.target.value as TeachingSkillCategory)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="set_induction">Set Induction (Introduction)</option>
                <option value="blackboard_skill">Blackboard / Smartboard</option>
                <option value="probing_questions">Probing Questions</option>
                <option value="stimulus_variation">Stimulus Variation</option>
                <option value="explanation_analogy">Explanation & Analogy</option>
                <option value="reinforcement_praise">Reinforcement Skill</option>
                <option value="classroom_management">Classroom Management</option>
                <option value="lesson_closure">Lesson Closure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Lesson Topic Title</label>
            <input
              type="text"
              required
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              placeholder="e.g. Archimedes' Principle & Buoyancy in Daily Life"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Lesson Objectives & Blackboard Summary */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Lesson Objectives (What students will learn)
            </label>
            <textarea
              rows={2}
              required
              value={lessonObjectives}
              onChange={(e) => setLessonObjectives(e.target.value)}
              placeholder="Key pedagogical objectives..."
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Blackboard Key Notes / Formulas (Shown on Reel Card)
            </label>
            <textarea
              rows={2}
              required
              value={blackboardNotes}
              onChange={(e) => setBlackboardNotes(e.target.value)}
              placeholder="Point-by-point blackboard summary..."
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none font-mono"
            />
          </div>

          {/* Granular Privacy & Topic Tagging Controls */}
          <TeachingPrivacyTaggingPanel
            privacyConfig={privacyConfig}
            onChangePrivacy={setPrivacyConfig}
            topicTags={topicTags}
            onUpdateTags={setTopicTags}
            compact={false}
          />

          {/* Respect Pledge & Anti-Abuse Warning */}
          <label className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl cursor-pointer hover:bg-amber-500/15 transition">
            <input
              type="checkbox"
              required
              checked={pledgeRespect}
              onChange={(e) => setPledgeRespect(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-amber-500 border-zinc-700 bg-zinc-800"
            />
            <span className="text-xs text-zinc-200 leading-snug">
              I certify this is an academic micro-teaching session. I pledge to adhere to the{' '}
              <strong className="text-amber-300">Apprentice Educator Code of Conduct</strong> and understand that inappropriate or abusive content triggers an automated account ban.
            </span>
          </label>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!pledgeRespect}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                pledgeRespect
                  ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Post Reel to Campus ({collegeCampus.slice(0, 24)}...)
            </button>
          </div>
        </form>

        {/* Community Conduct Pre-Submission Confirmation Modal */}
        <CommunityConductModal
          isOpen={isConductModalOpen}
          actionType="post"
          contentPreview={pendingPost ? `"${pendingPost.topicTitle}" (${pendingPost.subject})` : undefined}
          onConfirm={handleConfirmConduct}
          onCancel={() => setIsConductModalOpen(false)}
        />

        {/* Community Conduct Success Toast Notification */}
        {toastMessage && (
          <CommunityConductToast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
    </div>
  );
};
