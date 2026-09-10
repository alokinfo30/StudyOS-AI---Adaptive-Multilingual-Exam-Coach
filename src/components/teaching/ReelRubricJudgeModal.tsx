import React, { useState } from 'react';
import {
  Star,
  Award,
  CheckCircle2,
  X,
  UserCheck,
  GraduationCap,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  JudgeRole,
  RubricCriteriaScores,
  TeachingReelPost,
  TraineeEvaluation,
} from '../../types/teaching';
import { checkContentModeration } from '../../services/moderationService';

interface ReelRubricJudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: TeachingReelPost;
  onSubmitEvaluation: (evaluation: TraineeEvaluation) => void;
  onFlagViolation: (blockedText: string, words: string[]) => void;
}

export const ReelRubricJudgeModal: React.FC<ReelRubricJudgeModalProps> = ({
  isOpen,
  onClose,
  reel,
  onSubmitEvaluation,
  onFlagViolation,
}) => {
  const [evaluatorName, setEvaluatorName] = useState('Prof. A. K. Sharma');
  const [evaluatorRole, setEvaluatorRole] = useState<JudgeRole>('college_teacher');
  const [evaluatorDesignation, setEvaluatorDesignation] = useState('Senior Practicum Supervisor');
  const [evaluatorCollege, setEvaluatorCollege] = useState(reel.collegeCampus);
  const [qualitativeFeedback, setQualitativeFeedback] = useState(
    'Remarkable confidence and concept introduction! The probing questions engaged student thinking effectively.'
  );

  const [scores, setScores] = useState<RubricCriteriaScores>({
    setInduction: 9,
    blackboardWork: 9,
    explanationClarity: 9,
    probingQuestions: 8,
    voiceAndBodyLanguage: 9,
    lessonClosure: 8,
  });

  if (!isOpen) return null;

  const averageScore = Number(
    (
      (scores.setInduction +
        scores.blackboardWork +
        scores.explanationClarity +
        scores.probingQuestions +
        scores.voiceAndBodyLanguage +
        scores.lessonClosure) /
      6
    ).toFixed(1)
  );

  const handleScoreChange = (key: keyof RubricCriteriaScores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check feedback for inappropriate language
    const modResult = checkContentModeration(qualitativeFeedback);
    if (!modResult.isSafe) {
      onFlagViolation(qualitativeFeedback, modResult.flaggedWords);
      return;
    }

    const evaluation: TraineeEvaluation = {
      id: `eval_${Date.now()}`,
      evaluatorId: `user_${Date.now()}`,
      evaluatorName: evaluatorName.trim() || 'Anonymous Evaluator',
      evaluatorRole,
      evaluatorDesignation:
        evaluatorDesignation.trim() ||
        (evaluatorRole === 'college_teacher'
          ? 'Teacher Educator'
          : evaluatorRole === 'certified_judge'
          ? 'Official Judge'
          : 'Peer Trainee'),
      evaluatorAvatar:
        evaluatorRole === 'college_teacher'
          ? '👨‍🏫'
          : evaluatorRole === 'certified_judge'
          ? '⚖️'
          : '👨‍🎓',
      evaluatorCollege: evaluatorCollege.trim() || reel.collegeCampus,
      rubricScores: scores,
      overallScore: averageScore,
      qualitativeFeedback: qualitativeFeedback.trim(),
      timestamp: Date.now(),
    };

    onSubmitEvaluation(evaluation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div
        className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-zinc-100 relative my-6 max-h-[90vh] flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Evaluate Teaching Session
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {averageScore} / 10 Avg
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Trainee: <strong className="text-zinc-200">{reel.traineeName}</strong> • {reel.topicTitle}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-5 py-4 pr-1">
          {/* Evaluator Role Switcher */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
              Judging Capacity / Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEvaluatorRole('colleague_trainee');
                  setEvaluatorDesignation('B.Ed / BTC Peer Trainee');
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                  evaluatorRole === 'colleague_trainee'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base">👨‍🎓</span>
                <span>Colleague Trainee</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEvaluatorRole('college_teacher');
                  setEvaluatorDesignation('College Supervisor / Professor');
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                  evaluatorRole === 'college_teacher'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base">👨‍🏫</span>
                <span>Teacher Educator</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEvaluatorRole('certified_judge');
                  setEvaluatorDesignation('Official NCTE/NCVT Judge');
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                  evaluatorRole === 'certified_judge'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base">⚖️</span>
                <span>Certified Judge</span>
              </button>
            </div>
          </div>

          {/* Evaluator Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={evaluatorName}
                onChange={(e) => setEvaluatorName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                placeholder="Dr. / Er. / Trainee Name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Institution / Campus
              </label>
              <input
                type="text"
                required
                value={evaluatorCollege}
                onChange={(e) => setEvaluatorCollege(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                placeholder="College / DIET / University"
              />
            </div>
          </div>

          {/* NCTE / NCVT Micro-Teaching Rubric Sliders */}
          <div className="space-y-4 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Standard Micro-Teaching Rubrics (1 - 10 Scale)
            </h4>

            {/* Set Induction */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-300">1. Set Induction & Lesson Introduction</span>
                <span className="font-bold text-amber-400">{scores.setInduction} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.setInduction}
                onChange={(e) => handleScoreChange('setInduction', Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Blackboard Work */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-300">2. Blackboard / Smartboard Presentation Skill</span>
                <span className="font-bold text-amber-400">{scores.blackboardWork} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.blackboardWork}
                onChange={(e) => handleScoreChange('blackboardWork', Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Explanation Clarity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-300">3. Clarity of Concept & Real-World Analogy</span>
                <span className="font-bold text-amber-400">{scores.explanationClarity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.explanationClarity}
                onChange={(e) => handleScoreChange('explanationClarity', Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Probing Questions */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-300">4. Probing Questioning & Student Response</span>
                <span className="font-bold text-amber-400">{scores.probingQuestions} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.probingQuestions}
                onChange={(e) => handleScoreChange('probingQuestions', Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Voice & Body Language */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-300">5. Voice Modulation, Eye Contact & Presence</span>
                <span className="font-bold text-amber-400">{scores.voiceAndBodyLanguage} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.voiceAndBodyLanguage}
                onChange={(e) => handleScoreChange('voiceAndBodyLanguage', Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Lesson Closure */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-300">6. Lesson Closure & Recapitulation</span>
                <span className="font-bold text-amber-400">{scores.lessonClosure} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores.lessonClosure}
                onChange={(e) => handleScoreChange('lessonClosure', Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Constructive Pedagogical Remarks
            </label>
            <textarea
              required
              rows={3}
              value={qualitativeFeedback}
              onChange={(e) => setQualitativeFeedback(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              placeholder="Highlight strengths and specific recommendations for the trainee's practical phase..."
            />
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              Automated filter active. Please maintain professional educator decorum.
            </p>
          </div>

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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 text-zinc-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Official Evaluation ({averageScore}/10)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
