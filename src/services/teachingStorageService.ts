/**
 * Teaching Storage & Campus Reels Persistence Service
 * Manages micro-teaching practice takes and campus reels feed
 */

import {
  TeachingReelPost,
  TeachingTake,
  TraineeEvaluation,
  TraineeComment,
  SegmentFeedback,
  TeachingSessionDraft,
  CampusLeaderboardEntry,
} from '../types/teaching';

const CAMPUS_REELS_STORAGE_KEY = 'studyos_campus_teaching_reels';
const TEACHING_TAKES_STORAGE_KEY_PREFIX = 'studyos_teaching_takes_';
const TEACHING_DRAFTS_STORAGE_KEY_PREFIX = 'studyos_teaching_drafts_';

export const INITIAL_CAMPUS_REELS: TeachingReelPost[] = [
  {
    id: 'reel_bed_001',
    traineeId: 'trainee_ananya',
    traineeName: 'Ananya Sharma',
    traineeAvatar: '👩‍🏫',
    traineeProgram: 'b_ed',
    traineeYear: 'B.Ed Final Phase Intern',
    collegeCampus: 'District Institute of Education & Training (DIET), Lucknow',
    campusCity: 'Lucknow, UP',
    subject: 'Science • Physics',
    topicTitle: "Archimedes' Principle & Buoyant Force",
    targetClass: 'Class 9',
    skillFocus: 'set_induction',
    lessonObjectives: [
      'Induce curiosity using an apple floating vs iron nail sinking analogy',
      'Formulate probing questions leading students to discover buoyant force',
      'Demonstrate water displacement with a measuring cylinder',
    ],
    blackboardKeyNotes: [
      'Buoyant Force (Fb) = Weight of Displaced Fluid',
      'Density of Object < Density of Liquid => Float',
      'Density of Object > Density of Liquid => Sink',
    ],
    durationSeconds: 145,
    simulationStyle: 'physics_lab',
    likesCount: 68,
    applauseCount: 42,
    viewsCount: 312,
    sharesCount: 19,
    createdAt: Date.now() - 3600 * 1000 * 5,
    bestTakeStats: {
      speechPaceWpm: 122,
      clarityScore: 94,
      takesCount: 4,
    },
    rubricAverages: {
      setInduction: 9.4,
      blackboardWork: 8.8,
      explanationClarity: 9.2,
      probingQuestions: 9.0,
      voiceAndBodyLanguage: 9.1,
      lessonClosure: 8.7,
      overallAverage: 9.0,
      totalEvaluationsCount: 14,
    },
    evaluations: [
      {
        id: 'eval_01',
        evaluatorId: 'prof_mishra',
        evaluatorName: 'Dr. S. K. Mishra',
        evaluatorRole: 'college_teacher',
        evaluatorDesignation: 'HOD Science Pedagogy & Practicum Supervisor',
        evaluatorAvatar: '👨‍💼',
        evaluatorCollege: 'DIET Lucknow',
        rubricScores: {
          setInduction: 10,
          blackboardWork: 9,
          explanationClarity: 9,
          probingQuestions: 9,
          voiceAndBodyLanguage: 9,
          lessonClosure: 9,
        },
        overallScore: 9.2,
        qualitativeFeedback:
          'Outstanding set induction! Using real-world inquiry before introducing technical terms aligns with constructivist pedagogy.',
        timestamp: Date.now() - 3600 * 1000 * 4,
      },
      {
        id: 'eval_02',
        evaluatorId: 'peer_rahul',
        evaluatorName: 'Rahul Verma',
        evaluatorRole: 'colleague_trainee',
        evaluatorDesignation: 'B.Ed Classmate (Roll #24)',
        evaluatorAvatar: '👨‍🎓',
        evaluatorCollege: 'DIET Lucknow',
        rubricScores: {
          setInduction: 9,
          blackboardWork: 8,
          explanationClarity: 9,
          probingQuestions: 9,
          voiceAndBodyLanguage: 9,
          lessonClosure: 8,
        },
        overallScore: 8.7,
        qualitativeFeedback:
          'Great voice pitch and eye contact with the left and right rows. Very inspired by your classroom interaction!',
        timestamp: Date.now() - 3600 * 1000 * 3,
      },
    ],
    comments: [
      {
        id: 'comm_01',
        authorId: 'peer_priya',
        authorName: 'Priya Singh',
        authorAvatar: '👩‍🎓',
        authorRole: 'colleague_trainee',
        authorCollege: 'DIET Lucknow',
        text: 'The opening question about the ship floating while a tiny stone sinks was brilliant! Copied this idea for my internship diary.',
        timestamp: Date.now() - 3600 * 1000 * 4,
        likes: 12,
        isConstructiveFeedback: true,
      },
      {
        id: 'comm_02',
        authorId: 'prof_tripathi',
        authorName: 'Prof. R. N. Tripathi',
        authorAvatar: '👨‍🏫',
        authorRole: 'certified_judge',
        authorCollege: 'SCERT Practicum Board',
        text: 'Clean blackboard work. Remember to underline key equations with yellow chalk for enhanced optical legibility.',
        timestamp: Date.now() - 3600 * 1000 * 2,
        likes: 18,
        isConstructiveFeedback: true,
      },
    ],
    segmentFeedbacks: [
      {
        id: 'seg_01',
        timestampSeconds: 15,
        segmentLabel: 'Opening Set Induction Hook',
        rubricCriterion: 'setInduction',
        rating: 10,
        feedbackText: 'Superb transition from the floating apple demo into the core fluid displacement inquiry.',
        authorRole: 'college_teacher',
        authorName: 'Dr. S. K. Mishra',
        authorAvatar: '👨‍💼',
        authorCollege: 'DIET Lucknow',
        createdAt: Date.now() - 3600 * 1000 * 4,
      },
      {
        id: 'seg_02',
        timestampSeconds: 48,
        segmentLabel: 'Blackboard Formula Notation',
        rubricCriterion: 'blackboardWork',
        rating: 9,
        feedbackText: 'Legible division between buoyant force and density comparisons. Very neat handwriting.',
        authorRole: 'certified_judge',
        authorName: 'Prof. R. N. Tripathi',
        authorAvatar: '👨‍🏫',
        authorCollege: 'SCERT Practicum Board',
        createdAt: Date.now() - 3600 * 1000 * 2,
      },
      {
        id: 'seg_03',
        timestampSeconds: 82,
        segmentLabel: 'Handling Student Density Inquiry',
        rubricCriterion: 'probingQuestions',
        rating: 9,
        feedbackText: 'Encouraging tone when answering the student question about iron ships vs needles.',
        authorRole: 'colleague_trainee',
        authorName: 'Rahul Verma',
        authorAvatar: '👨‍🎓',
        authorCollege: 'DIET Lucknow',
        createdAt: Date.now() - 3600 * 1000 * 3,
      },
    ],
  },
  {
    id: 'reel_iti_002',
    traineeId: 'trainee_vikram',
    traineeName: 'Vikramaditya Chauhan',
    traineeAvatar: '👨‍🔧',
    traineeProgram: 'iti_trainer',
    traineeYear: 'CITS Apprentice Instructor',
    collegeCampus: 'National Skill Training Institute (NSTI), Kanpur',
    campusCity: 'Kanpur, UP',
    subject: 'ITI Trade • Electrician',
    topicTitle: "Ohm's Law Verification & Workshop Safety Interlocks",
    targetClass: 'ITI 1st Year',
    skillFocus: 'blackboard_skill',
    lessonObjectives: [
      'Explain V = I x R using water pipe hydraulic pressure analogy',
      'Demonstrate multimeter probe handling and safety isolation switch',
      'Enforce personal protective equipment (PPE) protocol before high voltage tests',
    ],
    blackboardKeyNotes: [
      'Voltage (V) in Volts [Potential Difference]',
      'Current (I) in Amperes [Rate of Charge Flow]',
      'Resistance (R) in Ohms [Opposition to Current]',
      'Safety First: Always verify zero energy before terminal connection',
    ],
    durationSeconds: 160,
    simulationStyle: 'iti_workshop',
    likesCount: 94,
    applauseCount: 65,
    viewsCount: 480,
    sharesCount: 31,
    createdAt: Date.now() - 3600 * 1000 * 8,
    bestTakeStats: {
      speechPaceWpm: 118,
      clarityScore: 92,
      takesCount: 3,
    },
    rubricAverages: {
      setInduction: 8.8,
      blackboardWork: 9.6,
      explanationClarity: 9.4,
      probingQuestions: 8.9,
      voiceAndBodyLanguage: 9.0,
      lessonClosure: 9.1,
      overallAverage: 9.1,
      totalEvaluationsCount: 19,
    },
    evaluations: [
      {
        id: 'eval_iti_01',
        evaluatorId: 'instructor_sharma',
        evaluatorName: 'Er. Rajeshwar Sharma',
        evaluatorRole: 'college_teacher',
        evaluatorDesignation: 'Senior Technical Officer (NCVT / DGT)',
        evaluatorAvatar: '👨‍🏫',
        evaluatorCollege: 'NSTI Kanpur',
        rubricScores: {
          setInduction: 9,
          blackboardWork: 10,
          explanationClarity: 9,
          probingQuestions: 9,
          voiceAndBodyLanguage: 9,
          lessonClosure: 9,
        },
        overallScore: 9.2,
        qualitativeFeedback:
          'Precise circuit schematic drawn on the board. Excellent emphasis on safety isolation drills.',
        timestamp: Date.now() - 3600 * 1000 * 6,
      },
    ],
    comments: [
      {
        id: 'comm_iti_01',
        authorId: 'trainee_deepak',
        authorName: 'Deepak Kumar',
        authorAvatar: '👨‍🔧',
        authorRole: 'colleague_trainee',
        authorCollege: 'NSTI Kanpur',
        text: 'The hydraulic pipe analogy for resistance is so clear for first-time trade trainees!',
        timestamp: Date.now() - 3600 * 1000 * 5,
        likes: 9,
        isConstructiveFeedback: true,
      },
    ],
  },
  {
    id: 'reel_btc_003',
    traineeId: 'trainee_sunita',
    traineeName: 'Sunita Patel',
    traineeAvatar: '👩‍🏫',
    traineeProgram: 'btc_deled',
    traineeYear: 'BTC / D.El.Ed 2nd Year Intern',
    collegeCampus: 'Govt Teachers Training College, Prayagraj',
    campusCity: 'Prayagraj, UP',
    subject: 'Mathematics • Arithmetic',
    topicTitle: 'Fractions & Equivalent Shares using Origami Folding',
    targetClass: 'Class 5',
    skillFocus: 'stimulus_variation',
    lessonObjectives: [
      'Demonstrate half (1/2), quarter (1/4), and eighths (1/8) by paper folding',
      'Encourage children to color equal portions to grasp equivalence visually',
      'Ask open-ended questions connecting pizza and roti sharing',
    ],
    blackboardKeyNotes: [
      'Numerator = Number of parts we have',
      'Denominator = Total equal parts in whole',
      '1/2 = 2/4 = 4/8 [Equivalent Fractions]',
    ],
    durationSeconds: 135,
    simulationStyle: 'interactive_classroom',
    likesCount: 82,
    applauseCount: 57,
    viewsCount: 395,
    sharesCount: 22,
    createdAt: Date.now() - 3600 * 1000 * 12,
    bestTakeStats: {
      speechPaceWpm: 114,
      clarityScore: 96,
      takesCount: 5,
    },
    rubricAverages: {
      setInduction: 9.6,
      blackboardWork: 9.0,
      explanationClarity: 9.5,
      probingQuestions: 9.3,
      voiceAndBodyLanguage: 9.6,
      lessonClosure: 9.2,
      overallAverage: 9.4,
      totalEvaluationsCount: 16,
    },
    evaluations: [
      {
        id: 'eval_btc_01',
        evaluatorId: 'dr_gupta',
        evaluatorName: 'Dr. Meenakshi Gupta',
        evaluatorRole: 'college_teacher',
        evaluatorDesignation: 'Professor of Elementary Pedagogy',
        evaluatorAvatar: '👩‍🏫',
        evaluatorCollege: 'Govt Teachers Training College',
        rubricScores: {
          setInduction: 10,
          blackboardWork: 9,
          explanationClarity: 10,
          probingQuestions: 9,
          voiceAndBodyLanguage: 10,
          lessonClosure: 9,
        },
        overallScore: 9.5,
        qualitativeFeedback:
          'Exemplary concrete-to-abstract transition using paper manipulative. Primary students will grasp this effortlessly.',
        timestamp: Date.now() - 3600 * 1000 * 10,
      },
    ],
    comments: [
      {
        id: 'comm_btc_01',
        authorId: 'trainee_neha',
        authorName: 'Neha Awasthi',
        authorAvatar: '👩‍🎓',
        authorRole: 'colleague_trainee',
        authorCollege: 'Govt Teachers Training College',
        text: 'The warm smiling presence and patient listening during student answers is so inspiring!',
        timestamp: Date.now() - 3600 * 1000 * 8,
        likes: 14,
        isConstructiveFeedback: true,
      },
    ],
  },
];

/**
 * Load all campus reels
 */
export function loadCampusReels(): TeachingReelPost[] {
  try {
    const stored = localStorage.getItem(CAMPUS_REELS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load campus reels:', err);
  }

  saveCampusReels(INITIAL_CAMPUS_REELS);
  return INITIAL_CAMPUS_REELS;
}

/**
 * Persist all campus reels
 */
export function saveCampusReels(reels: TeachingReelPost[]): void {
  try {
    localStorage.setItem(CAMPUS_REELS_STORAGE_KEY, JSON.stringify(reels));
  } catch (err) {
    console.error('Failed to save campus reels:', err);
  }
}

/**
 * Publish a new micro-teaching reel to the campus feed
 */
export function publishReelPost(post: TeachingReelPost): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = [post, ...current];
  saveCampusReels(updated);
  return updated;
}

/**
 * Add a formal evaluation from a colleague, teacher, or certified judge
 */
export function addReelEvaluation(
  reelId: string,
  evaluation: TraineeEvaluation
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;

    const newEvaluations = [evaluation, ...reel.evaluations];
    const totalCount = newEvaluations.length;

    // Recalculate rubric averages
    const sumSet = newEvaluations.reduce((acc, e) => acc + e.rubricScores.setInduction, 0);
    const sumBb = newEvaluations.reduce((acc, e) => acc + e.rubricScores.blackboardWork, 0);
    const sumExp = newEvaluations.reduce((acc, e) => acc + e.rubricScores.explanationClarity, 0);
    const sumProb = newEvaluations.reduce((acc, e) => acc + e.rubricScores.probingQuestions, 0);
    const sumVoice = newEvaluations.reduce((acc, e) => acc + e.rubricScores.voiceAndBodyLanguage, 0);
    const sumClose = newEvaluations.reduce((acc, e) => acc + e.rubricScores.lessonClosure, 0);
    const sumOverall = newEvaluations.reduce((acc, e) => acc + e.overallScore, 0);

    return {
      ...reel,
      evaluations: newEvaluations,
      rubricAverages: {
        setInduction: Number((sumSet / totalCount).toFixed(1)),
        blackboardWork: Number((sumBb / totalCount).toFixed(1)),
        explanationClarity: Number((sumExp / totalCount).toFixed(1)),
        probingQuestions: Number((sumProb / totalCount).toFixed(1)),
        voiceAndBodyLanguage: Number((sumVoice / totalCount).toFixed(1)),
        lessonClosure: Number((sumClose / totalCount).toFixed(1)),
        overallAverage: Number((sumOverall / totalCount).toFixed(1)),
        totalEvaluationsCount: totalCount,
      },
    };
  });

  saveCampusReels(updated);
  return updated;
}

/**
 * Add a respectful comment to a reel
 */
export function addReelComment(
  reelId: string,
  comment: TraineeComment
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    const newComments = [comment, ...reel.comments];
    // Keep pinned helpful comments at the top
    newComments.sort((a, b) => {
      if (a.isMarkedHelpful && !b.isMarkedHelpful) return -1;
      if (!a.isMarkedHelpful && b.isMarkedHelpful) return 1;
      return b.timestamp - a.timestamp;
    });
    return {
      ...reel,
      comments: newComments,
    };
  });

  saveCampusReels(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studyos_campus_reels_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Toggle like on a peer review comment
 */
export function toggleCommentLike(
  reelId: string,
  commentId: string,
  userId: string = 'current_trainee'
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    const updatedComments = reel.comments.map((comm) => {
      if (comm.id !== commentId) return comm;
      const likedList = comm.likedByUserIds || [];
      const isAlreadyLiked = likedList.includes(userId);
      const newLikedList = isAlreadyLiked
        ? likedList.filter((id) => id !== userId)
        : [...likedList, userId];
      const newLikesCount = Math.max(0, isAlreadyLiked ? comm.likes - 1 : comm.likes + 1);
      return {
        ...comm,
        likes: newLikesCount,
        likedByUserIds: newLikedList,
      };
    });

    return {
      ...reel,
      comments: updatedComments,
    };
  });

  saveCampusReels(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studyos_campus_reels_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Toggle Mark as Helpful on a comment (pins pedagogical advice to top)
 */
export function toggleCommentMarkHelpful(
  reelId: string,
  commentId: string,
  markedBy: string = 'current_trainee'
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    const updatedComments = reel.comments.map((comm) => {
      if (comm.id !== commentId) return comm;
      const willBeHelpful = !comm.isMarkedHelpful;
      return {
        ...comm,
        isMarkedHelpful: willBeHelpful,
        markedHelpfulAt: willBeHelpful ? Date.now() : undefined,
        markedHelpfulBy: willBeHelpful ? markedBy : undefined,
      };
    });

    // Pinned helpful comments float to the very top
    updatedComments.sort((a, b) => {
      if (a.isMarkedHelpful && !b.isMarkedHelpful) return -1;
      if (!a.isMarkedHelpful && b.isMarkedHelpful) return 1;
      if (a.isMarkedHelpful && b.isMarkedHelpful) {
        return (b.markedHelpfulAt || 0) - (a.markedHelpfulAt || 0);
      }
      return b.timestamp - a.timestamp;
    });

    return {
      ...reel,
      comments: updatedComments,
    };
  });

  saveCampusReels(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studyos_campus_reels_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Toggle like on a timestamped segment feedback
 */
export function toggleSegmentFeedbackLike(
  reelId: string,
  feedbackId: string,
  userId: string = 'current_trainee'
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    const existing = reel.segmentFeedbacks || [];
    const updatedFeedbacks = existing.map((seg) => {
      if (seg.id !== feedbackId) return seg;
      const likedList = seg.likedByUserIds || [];
      const isAlreadyLiked = likedList.includes(userId);
      const newLikedList = isAlreadyLiked
        ? likedList.filter((id) => id !== userId)
        : [...likedList, userId];
      const baseLikes = seg.likes || 0;
      const newLikesCount = Math.max(0, isAlreadyLiked ? baseLikes - 1 : baseLikes + 1);
      return {
        ...seg,
        likes: newLikesCount,
        likedByUserIds: newLikedList,
      };
    });

    return {
      ...reel,
      segmentFeedbacks: updatedFeedbacks,
    };
  });

  saveCampusReels(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studyos_campus_reels_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Toggle Mark as Helpful on a segment feedback (pins to top of feedback list)
 */
export function toggleSegmentFeedbackHelpful(
  reelId: string,
  feedbackId: string,
  markedBy: string = 'current_trainee'
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    const existing = reel.segmentFeedbacks || [];
    const updatedFeedbacks = existing.map((seg) => {
      if (seg.id !== feedbackId) return seg;
      const willBeHelpful = !seg.isMarkedHelpful;
      return {
        ...seg,
        isMarkedHelpful: willBeHelpful,
        markedHelpfulAt: willBeHelpful ? Date.now() : undefined,
        markedHelpfulBy: willBeHelpful ? markedBy : undefined,
      };
    });

    // Pinned helpful segment feedbacks appear first
    updatedFeedbacks.sort((a, b) => {
      if (a.isMarkedHelpful && !b.isMarkedHelpful) return -1;
      if (!a.isMarkedHelpful && b.isMarkedHelpful) return 1;
      return a.timestampSeconds - b.timestampSeconds;
    });

    return {
      ...reel,
      segmentFeedbacks: updatedFeedbacks,
    };
  });

  saveCampusReels(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studyos_campus_reels_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Toggle like for a reel
 */
export function toggleReelLike(reelId: string): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    return { ...reel, likesCount: reel.likesCount + 1 };
  });
  saveCampusReels(updated);
  return updated;
}

/**
 * Toggle applause / clapping for a reel
 */
export function toggleReelApplause(reelId: string): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;
    return { ...reel, applauseCount: reel.applauseCount + 1 };
  });
  saveCampusReels(updated);
  return updated;
}

/**
 * Load user's practice takes
 */
export function loadTeachingTakes(userId: string = 'current_trainee'): TeachingTake[] {
  try {
    const stored = localStorage.getItem(`${TEACHING_TAKES_STORAGE_KEY_PREFIX}${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load teaching takes:', err);
  }
  return [];
}

/**
 * Save user's practice takes
 */
export function saveTeachingTakes(
  takes: TeachingTake[],
  userId: string = 'current_trainee'
): void {
  try {
    localStorage.setItem(
      `${TEACHING_TAKES_STORAGE_KEY_PREFIX}${userId}`,
      JSON.stringify(takes)
    );
  } catch (err) {
    console.error('Failed to save teaching takes:', err);
  }
}

/**
 * Set a specific take as the best take for publishing
 */
export function setBestTeachingTake(
  takeId: string,
  userId: string = 'current_trainee'
): TeachingTake[] {
  const takes = loadTeachingTakes(userId);
  const updated = takes.map((take) => ({
    ...take,
    isBestTake: take.id === takeId,
  }));
  saveTeachingTakes(updated, userId);
  return updated;
}

/**
 * Add a timestamped segment feedback from a colleague, teacher, or judge to a reel
 */
export function addReelSegmentFeedback(
  reelId: string,
  segmentFeedback: SegmentFeedback
): TeachingReelPost[] {
  const current = loadCampusReels();
  const updated = current.map((reel) => {
    if (reel.id !== reelId) return reel;

    const existingFeedbacks = reel.segmentFeedbacks || [];
    const newFeedbacks = [...existingFeedbacks, segmentFeedback].sort(
      (a, b) => a.timestampSeconds - b.timestampSeconds
    );

    return {
      ...reel,
      segmentFeedbacks: newFeedbacks,
    };
  });

  saveCampusReels(updated);
  return updated;
}

/**
 * Initial sample drafts to guide trainees on how draft sessions work
 */
export const INITIAL_TEACHING_DRAFTS: TeachingSessionDraft[] = [
  {
    id: 'draft_newton_01',
    userId: 'current_trainee',
    topicTitle: "Newton's Third Law & Action-Reaction Demo",
    subject: 'Science • Physics',
    targetClass: 'Class 9',
    program: 'b_ed',
    skillFocus: 'explanation_analogy',
    lessonObjectives:
      'Introduce equal and opposite forces using a deflating balloon rocket on a taut string; contrast with walking friction.',
    blackboardKeyNotes: [
      'Forces always occur in paired actions (Fa = -Fb)',
      'Action and Reaction act on DIFFERENT objects',
      'Momentum conservation in rocket propulsion',
    ],
    rawDurationSeconds: 112,
    trimRange: {
      startSeconds: 4,
      endSeconds: 98,
    },
    isTrimmed: true,
    lightingQualityScore: 88,
    audioQualityScore: 92,
    speechPaceWpm: 124,
    savedAt: Date.now() - 3600 * 1000 * 3,
    updatedAt: Date.now() - 3600 * 1000 * 2,
    notes: 'Opening balloon release hook is sharp. Need to trim the 4-second initial silence and review blackboard diagram before publishing to campus feed.',
    simulationStyle: 'physics_lab',
    take: {
      id: 'take_draft_01',
      takeNumber: 2,
      durationSeconds: 94,
      recordedAt: Date.now() - 3600 * 1000 * 3,
      speechPaceWpm: 124,
      clarityScore: 92,
      voiceModulationScore: 90,
      studentEngagementScore: 91,
      detectedPedagogicalKeywords: ['Action-Reaction', 'Newton Third Law', 'Opposite Direction', 'Balloon Rocket'],
      rubricSelfRatings: {
        setInduction: 9,
        blackboardWork: 8,
        explanationClarity: 9,
        probingQuestions: 8,
        bodyLanguage: 9,
        lessonClosure: 8,
      },
      aiFeedback: {
        strengths: ['Great balloon prop analogy', 'Good voice volume above 65 dB'],
        improvements: ['Cut initial 4s setup dead time', 'Write vector arrows clearly on board'],
        pedagogicalTip: 'Ensure students understand action and reaction forces do NOT cancel each other out because they act on separate bodies.',
      },
      virtualStudentInteractions: [
        {
          studentName: 'Aarav (Class 9)',
          question: 'Sir, if action and reaction are equal, why does the rocket move forward instead of staying still?',
          resolved: true,
        },
      ],
      isBestTake: true,
      trimRange: {
        startSeconds: 4,
        endSeconds: 98,
      },
      isTrimmed: true,
    },
  },
];

/**
 * Load saved teaching drafts
 */
export function loadTeachingDrafts(userId: string = 'current_trainee'): TeachingSessionDraft[] {
  try {
    const key = `${TEACHING_DRAFTS_STORAGE_KEY_PREFIX}${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Seed initial sample drafts for current_trainee on first launch
    if (userId === 'current_trainee') {
      localStorage.setItem(key, JSON.stringify(INITIAL_TEACHING_DRAFTS));
      return INITIAL_TEACHING_DRAFTS;
    }
  } catch (err) {
    console.error('Failed to load teaching drafts:', err);
  }
  return [];
}

/**
 * Save a teaching draft
 */
export function saveTeachingDraft(
  draft: TeachingSessionDraft,
  userId: string = 'current_trainee'
): TeachingSessionDraft[] {
  try {
    const key = `${TEACHING_DRAFTS_STORAGE_KEY_PREFIX}${userId}`;
    const currentDrafts = loadTeachingDrafts(userId);
    const existingIndex = currentDrafts.findIndex((d) => d.id === draft.id);

    let updated: TeachingSessionDraft[];
    if (existingIndex >= 0) {
      updated = currentDrafts.map((d) =>
        d.id === draft.id ? { ...draft, updatedAt: Date.now() } : d
      );
    } else {
      updated = [{ ...draft, savedAt: Date.now(), updatedAt: Date.now() }, ...currentDrafts];
    }

    localStorage.setItem(key, JSON.stringify(updated));
    // Dispatch custom event for real-time reactive sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('studyos_teaching_drafts_updated', { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Failed to save teaching draft:', err);
    return [];
  }
}

/**
 * Delete a teaching draft
 */
export function deleteTeachingDraft(
  draftId: string,
  userId: string = 'current_trainee'
): TeachingSessionDraft[] {
  try {
    const key = `${TEACHING_DRAFTS_STORAGE_KEY_PREFIX}${userId}`;
    const currentDrafts = loadTeachingDrafts(userId);
    const updated = currentDrafts.filter((d) => d.id !== draftId);
    localStorage.setItem(key, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('studyos_teaching_drafts_updated', { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Failed to delete teaching draft:', err);
    return [];
  }
}

/**
 * Get a specific draft by ID
 */
export function getTeachingDraft(
  draftId: string,
  userId: string = 'current_trainee'
): TeachingSessionDraft | null {
  const drafts = loadTeachingDrafts(userId);
  return drafts.find((d) => d.id === draftId) || null;
}

/**
 * Real-time Campus Leaderboard Aggregation Engine
 * Computes rankings across all peer evaluations and total teaching engagement
 */
export function calculateCampusLeaderboard(
  currentUserId: string = 'current_trainee',
  currentUserName: string = 'You (Apprentice Trainee)'
): CampusLeaderboardEntry[] {
  const reels = loadCampusReels();
  const takes = loadTeachingTakes(currentUserId);

  // Group stats by trainee
  const traineeMap = new Map<
    string,
    {
      traineeId: string;
      traineeName: string;
      traineeAvatar: string;
      traineeProgram: any;
      traineeYear: string;
      collegeCampus: string;
      campusCity: string;
      evaluations: TraineeEvaluation[];
      likesCount: number;
      applauseCount: number;
      viewsCount: number;
      commentsCount: number;
      reelsCount: number;
      featuredTopic: string;
      featuredReelId: string;
      skillCounts: Record<string, number>;
      rubricSum: number;
      rubricCount: number;
    }
  >();

  // Aggregate stats from published reels
  reels.forEach((reel) => {
    const id = reel.traineeId;
    if (!traineeMap.has(id)) {
      traineeMap.set(id, {
        traineeId: id,
        traineeName: reel.traineeName,
        traineeAvatar: reel.traineeAvatar,
        traineeProgram: reel.traineeProgram,
        traineeYear: reel.traineeYear,
        collegeCampus: reel.collegeCampus,
        campusCity: reel.campusCity,
        evaluations: [...(reel.evaluations || [])],
        likesCount: reel.likesCount || 0,
        applauseCount: reel.applauseCount || 0,
        viewsCount: reel.viewsCount || 0,
        commentsCount: reel.comments?.length || 0,
        reelsCount: 1,
        featuredTopic: reel.topicTitle,
        featuredReelId: reel.id,
        skillCounts: { [reel.skillFocus]: 1 },
        rubricSum: (reel.rubricAverages?.overallAverage || 9.0) * (reel.rubricAverages?.totalEvaluationsCount || 1),
        rubricCount: reel.rubricAverages?.totalEvaluationsCount || 1,
      });
    } else {
      const entry = traineeMap.get(id)!;
      entry.likesCount += reel.likesCount || 0;
      entry.applauseCount += reel.applauseCount || 0;
      entry.viewsCount += reel.viewsCount || 0;
      entry.commentsCount += reel.comments?.length || 0;
      entry.reelsCount += 1;
      entry.evaluations.push(...(reel.evaluations || []));
      entry.skillCounts[reel.skillFocus] = (entry.skillCounts[reel.skillFocus] || 0) + 1;
      entry.rubricSum += (reel.rubricAverages?.overallAverage || 9.0) * (reel.rubricAverages?.totalEvaluationsCount || 1);
      entry.rubricCount += reel.rubricAverages?.totalEvaluationsCount || 1;
    }
  });

  // Ensure current user is on leaderboard if they have practice takes or a reel
  if (!traineeMap.has(currentUserId)) {
    const userBestTakesCount = takes.length;
    traineeMap.set(currentUserId, {
      traineeId: currentUserId,
      traineeName: currentUserName,
      traineeAvatar: '👨‍🎓',
      traineeProgram: 'b_ed',
      traineeYear: 'B.Ed Teacher Intern',
      collegeCampus: 'DIET Campus / NCTE Practicum Lab',
      campusCity: 'Lucknow, UP',
      evaluations: [],
      likesCount: 18,
      applauseCount: 12,
      viewsCount: 85,
      commentsCount: 3,
      reelsCount: 0,
      featuredTopic: 'Micro-Teaching Practicum Practice',
      featuredReelId: '',
      skillCounts: { set_induction: userBestTakesCount || 1 },
      rubricSum: 8.8 * Math.max(1, userBestTakesCount),
      rubricCount: Math.max(1, userBestTakesCount),
    });
  }

  // Calculate scores
  const entries: CampusLeaderboardEntry[] = Array.from(traineeMap.values()).map((t) => {
    const peerReviewScore = Math.min(10, Math.round((t.rubricSum / Math.max(1, t.rubricCount)) * 10) / 10);
    // Weighted engagement: Views (1x) + Likes (4x) + Applause (6x) + Comments (5x) + Evaluations (10x)
    const engagementTotal =
      t.viewsCount +
      t.likesCount * 4 +
      t.applauseCount * 6 +
      t.commentsCount * 5 +
      t.rubricCount * 10;

    // Composite score: 65% Peer Review Rubric Mastery + 35% Campus Engagement
    const normalizedReview = (peerReviewScore / 10) * 65;
    const normalizedEngagement = Math.min(35, (engagementTotal / 750) * 35);
    const compositeScore = Math.round((normalizedReview + normalizedEngagement) * 10) / 10;

    // Determine top skill badge
    let topSkill = 'Set Induction';
    const topKey = Object.entries(t.skillCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (topKey === 'blackboard_skill') topSkill = 'Blackboard Master';
    else if (topKey === 'stimulus_variation') topSkill = 'Stimulus & Gestures';
    else if (topKey === 'probing_questions') topSkill = 'Inquiry & Probing';
    else if (topKey === 'explanation_analogy') topSkill = 'Real-world Analogies';
    else if (topKey === 'lesson_closure') topSkill = 'Recapitulation';

    return {
      rank: 1, // calculated next
      previousRank: 1,
      traineeId: t.traineeId,
      traineeName: t.traineeName,
      traineeAvatar: t.traineeAvatar,
      traineeProgram: t.traineeProgram,
      traineeYear: t.traineeYear,
      collegeCampus: t.collegeCampus,
      campusCity: t.campusCity,
      peerReviewScore,
      totalEvaluationsCount: t.rubricCount,
      totalEngagementScore: engagementTotal,
      compositeScore,
      totalTakesRecorded: t.traineeId === currentUserId ? takes.length || 3 : 4,
      reelsPublishedCount: t.reelsCount,
      featuredTopicTitle: t.featuredTopic,
      featuredReelId: t.featuredReelId,
      likesCount: t.likesCount,
      applauseCount: t.applauseCount,
      viewsCount: t.viewsCount,
      topSkillBadge: topSkill,
      isCurrentUser: t.traineeId === currentUserId,
    };
  });

  // Sort by composite score descending
  entries.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore;
    }
    return b.peerReviewScore - a.peerReviewScore;
  });

  // Assign ranks & simulated previous rank for trend arrows
  return entries.map((entry, index) => {
    const rank = index + 1;
    // previous rank simulation
    const diff = (entry.traineeId.charCodeAt(entry.traineeId.length - 1) % 3) - 1;
    const previousRank = Math.max(1, rank + diff);
    return {
      ...entry,
      rank,
      previousRank,
    };
  });
}
