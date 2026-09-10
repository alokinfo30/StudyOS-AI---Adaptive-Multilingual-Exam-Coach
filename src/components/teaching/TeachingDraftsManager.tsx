import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Trash2,
  Play,
  Scissors,
  UploadCloud,
  Clock,
  Sparkles,
  Award,
  Video,
  Sun,
  Mic,
  Calendar,
  ChevronRight,
  AlertCircle,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import {
  TeachingSessionDraft,
  TeachingTake,
  TeachingSkillCategory,
  TeacherTrainingProgram,
} from '../../types/teaching';
import {
  loadTeachingDrafts,
  deleteTeachingDraft,
  saveTeachingDraft,
} from '../../services/teachingStorageService';
import { playMasteryPopSound } from '../../utils/audioEffects';

interface TeachingDraftsManagerProps {
  userId: string;
  onResumeDraft: (draft: TeachingSessionDraft) => void;
  onPublishDraft: (draft: TeachingSessionDraft) => void;
  onStartNewSession: () => void;
}

export const TeachingDraftsManager: React.FC<TeachingDraftsManagerProps> = ({
  userId,
  onResumeDraft,
  onPublishDraft,
  onStartNewSession,
}) => {
  const [drafts, setDrafts] = useState<TeachingSessionDraft[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [draftToDelete, setDraftToDelete] = useState<TeachingSessionDraft | null>(null);
  const [editingNotesDraftId, setEditingNotesDraftId] = useState<string | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');

  const refreshDrafts = () => {
    const loaded = loadTeachingDrafts(userId);
    setDrafts(loaded);
  };

  useEffect(() => {
    refreshDrafts();

    // Listen to real-time custom event for reactive sync across tabs
    const handleDraftsUpdated = () => {
      refreshDrafts();
    };

    window.addEventListener('studyos_teaching_drafts_updated', handleDraftsUpdated);
    return () => {
      window.removeEventListener('studyos_teaching_drafts_updated', handleDraftsUpdated);
    };
  }, [userId]);

  const handleDeleteConfirm = () => {
    if (!draftToDelete) return;
    const updated = deleteTeachingDraft(draftToDelete.id, userId);
    setDrafts(updated);
    setDraftToDelete(null);
  };

  const handleSaveNotes = (draft: TeachingSessionDraft) => {
    const updatedDraft: TeachingSessionDraft = {
      ...draft,
      notes: tempNotesText,
      updatedAt: Date.now(),
    };
    const updated = saveTeachingDraft(updatedDraft, userId);
    setDrafts(updated);
    setEditingNotesDraftId(null);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffHours = Math.floor((Date.now() - timestamp) / (1000 * 3600));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const filteredDrafts = drafts.filter((d) => {
    const matchesSearch =
      d.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.notes && d.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill =
      selectedSkillFilter === 'all' || d.skillFocus === selectedSkillFilter;
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold font-mono">
              Local Storage Protected
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-mono">
              {drafts.length} {drafts.length === 1 ? 'Session Saved' : 'Sessions Saved'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <span>Partially Recorded Teaching Drafts</span>
            <FolderOpen className="w-5 h-5 text-teal-400" />
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Save raw takes, custom trim slider boundaries, and studio notes locally before publishing to the campus feed. Review, resume, or re-record at your own pace.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewSession}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Studio Session</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved drafts by topic or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Micro-Teaching Skills</option>
            <option value="set_induction">Set Induction Hook</option>
            <option value="blackboard_skill">Blackboard / Smartboard Work</option>
            <option value="probing_questions">Probing Questions</option>
            <option value="stimulus_variation">Stimulus Variation</option>
            <option value="explanation_analogy">Real-World Analogies</option>
            <option value="lesson_closure">Lesson Closure & Recapitulation</option>
          </select>
        </div>
      </div>

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-zinc-200">No Teaching Drafts Found</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {searchQuery || selectedSkillFilter !== 'all'
                ? 'No drafts match your search or skill filter. Try clearing the filter.'
                : 'Whenever you record a take in the AI Practice Studio, click "Save as Draft" to keep your unfinalized take safe.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartNewSession}
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition"
          >
            Launch Practice Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDrafts.map((draft) => {
            const trimmedDuration = draft.trimRange
              ? Math.max(5, draft.trimRange.endSeconds - draft.trimRange.startSeconds)
              : draft.rawDurationSeconds;

            return (
              <div
                key={draft.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg transition flex flex-col justify-between"
              >
                {/* Draft Card Top Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {draft.program.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                        {draft.skillFocus.replace('_', ' ')}
                      </span>
                      {draft.isTrimmed && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          <span>Trimmed</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-zinc-500 font-mono shrink-0">
                      Saved {formatRelativeTime(draft.updatedAt || draft.savedAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-100 leading-snug">
                    {draft.topicTitle}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>{draft.subject}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{draft.targetClass}</span>
                  </div>
                </div>

                {/* Duration & Trimming Status Bar */}
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-zinc-300 font-bold">
                        Duration: {formatSeconds(trimmedDuration)}
                      </span>
                      {draft.trimRange && (
                        <span className="text-[11px] text-zinc-500">
                          (Raw: {formatSeconds(draft.rawDurationSeconds)})
                        </span>
                      )}
                    </div>
                    {draft.trimRange && (
                      <span className="text-[11px] text-cyan-400 font-bold">
                        Range: {formatSeconds(draft.trimRange.startSeconds)} - {formatSeconds(draft.trimRange.endSeconds)}
                      </span>
                    )}
                  </div>

                  {/* Quality Diagnostics Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
                    {draft.lightingQualityScore !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono">
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>Light: {draft.lightingQualityScore}%</span>
                      </span>
                    )}
                    {draft.audioQualityScore !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono">
                        <Mic className="w-3 h-3 text-emerald-400" />
                        <span>Audio: {draft.audioQualityScore}%</span>
                      </span>
                    )}
                    {draft.speechPaceWpm !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{draft.speechPaceWpm} WPM</span>
                      </span>
                    )}
                    {draft.take?.virtualStudentInteractions && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>1 Inquiry Handled</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Practicum Notes / Reflection */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-bold flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trainee Practicum Notes:</span>
                    </span>
                    {editingNotesDraftId !== draft.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesDraftId(draft.id);
                          setTempNotesText(draft.notes || '');
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{draft.notes ? 'Edit Note' : 'Add Note'}</span>
                      </button>
                    )}
                  </div>

                  {editingNotesDraftId === draft.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={tempNotesText}
                        onChange={(e) => setTempNotesText(e.target.value)}
                        placeholder="Add notes for your supervisor or things to improve before campus publish..."
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesDraftId(null)}
                          className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(draft)}
                          className="px-3 py-1 bg-amber-500 text-zinc-950 rounded-lg text-[11px] font-bold hover:bg-amber-400"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-400 italic bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/60 leading-relaxed">
                      {draft.notes || 'No reflections added yet. You can jot down notes before finalizing.'}
                    </p>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftToDelete(draft)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onResumeDraft(draft)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition flex items-center gap-1.5"
                      title="Resume recording or re-trim in Practice Studio"
                    >
                      <Scissors className="w-3.5 h-3.5 text-amber-400" />
                      <span>Resume & Trim</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPublishDraft(draft)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                      title="Open campus publish review for this draft"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Publish to Campus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-100">Delete Draft Session?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to delete <strong>"{draftToDelete.topicTitle}"</strong>? This will permanently remove the partially recorded take from your browser storage.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDraftToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition shadow-lg shadow-rose-500/20"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
