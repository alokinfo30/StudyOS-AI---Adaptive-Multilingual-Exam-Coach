import React, { useState } from 'react';
import { PrivacyAccessConfig, PracticePrivacySetting } from '../../types/teaching';
import { Globe, Lock, Tag, Plus, X, Users, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface TeachingPrivacyTaggingPanelProps {
  privacyConfig: PrivacyAccessConfig;
  onChangePrivacy: (config: PrivacyAccessConfig) => void;
  topicTags: string[];
  onUpdateTags: (tags: string[]) => void;
  compact?: boolean;
}

const PRESET_TOPIC_TAGS = [
  'Algebra',
  'Physics',
  'Pedagogy',
  'Geometry',
  'Set Induction',
  'Blackboard Notation',
  'Probing Questions',
  'Classroom Management',
  'Lesson Closure',
  'ITI Electrician',
  'Science Lab',
  'Manipulatives',
];

const PRESET_PEERS_AND_SUPERVISORS = [
  { id: 'sup_mishra', name: 'Dr. S. K. Mishra (Supervisor)', role: 'Practicum Supervisor' },
  { id: 'board_tripathi', name: 'Prof. R. N. Tripathi (SCERT)', role: 'Certified Board Judge' },
  { id: 'peer_priya', name: 'Priya Singh (B.Ed Colleague)', role: 'Peer Trainee' },
  { id: 'peer_deepak', name: 'Deepak Kumar (ITI Instructor)', role: 'Colleague Apprentice' },
  { id: 'peer_neha', name: 'Neha Awasthi (D.El.Ed)', role: 'Cohort Peer' },
];

export const TeachingPrivacyTaggingPanel: React.FC<TeachingPrivacyTaggingPanelProps> = ({
  privacyConfig,
  onChangePrivacy,
  topicTags,
  onUpdateTags,
  compact = false,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [newPeerInput, setNewPeerInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);

  const isPrivate = privacyConfig.privacy === 'private';
  const allowedPeerNames = privacyConfig.allowedPeerNames || [
    'Dr. S. K. Mishra (Supervisor)',
    'Priya Singh (B.Ed Colleague)',
  ];

  // Handle privacy mode switch
  const handleSelectPrivacy = (mode: PracticePrivacySetting) => {
    onChangePrivacy({
      ...privacyConfig,
      privacy: mode,
      allowedPeerNames: mode === 'private' ? allowedPeerNames : undefined,
      targetGroup: mode === 'private' ? (privacyConfig.targetGroup || 'Supervisor & Peer Review Cohort') : undefined,
    });
  };

  // Add a topic tag
  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (!clean) return;
    if (topicTags.some((t) => t.toLowerCase() === clean.toLowerCase())) return;
    onUpdateTags([...topicTags, clean]);
    setNewTagInput('');
  };

  // Remove a topic tag
  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(topicTags.filter((t) => t !== tagToRemove));
  };

  // Toggle allowed peer in private mode
  const handleTogglePeer = (peerName: string) => {
    const current = allowedPeerNames;
    let next: string[];
    if (current.includes(peerName)) {
      next = current.filter((p) => p !== peerName);
    } else {
      next = [...current, peerName];
    }
    onChangePrivacy({
      ...privacyConfig,
      allowedPeerNames: next,
    });
  };

  // Add custom peer
  const handleAddCustomPeer = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPeerInput.trim();
    if (!clean) return;
    if (!allowedPeerNames.includes(clean)) {
      onChangePrivacy({
        ...privacyConfig,
        allowedPeerNames: [...allowedPeerNames, clean],
      });
    }
    setNewPeerInput('');
  };

  return (
    <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-4 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Privacy & Topic Discovery Settings</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                {isPrivate ? 'Private Practice' : 'Campus Public'} • {topicTags.length} Tags
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              Configure session audience visibility and categorize pedagogical topics for feed discovery
            </p>
          </div>
        </div>

        {compact && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 transition"
          >
            {isExpanded ? 'Collapse' : 'Configure'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* 1. GRANULAR PRIVACY SETTINGS */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Practice Recording Privacy</span>
              <span className="text-[10px] font-normal normal-case text-zinc-500">
                (Choose who can view this teaching session)
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Public Option */}
              <button
                type="button"
                onClick={() => handleSelectPrivacy('public')}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  !isPrivate
                    ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm ring-1 ring-amber-500/20'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    !isPrivate ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Public (Entire Campus)</span>
                    {!isPrivate && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Visible to all apprentice teachers, college professors, and certified evaluators on the campus feed.
                  </p>
                </div>
              </button>

              {/* Private Option */}
              <button
                type="button"
                onClick={() => handleSelectPrivacy('private')}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  isPrivate
                    ? 'bg-indigo-500/15 border-indigo-500/50 text-white shadow-sm ring-1 ring-indigo-500/20'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isPrivate ? 'bg-indigo-500 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Private (Specific Peers & Instructors)</span>
                    {isPrivate && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Restricted viewing. Only accessible to designated supervisors, mentors, or invited peer trainees.
                  </p>
                </div>
              </button>
            </div>

            {/* If Private is selected: Grant specific access */}
            {isPrivate && (
              <div className="p-3 bg-zinc-900/90 border border-indigo-500/30 rounded-xl space-y-3 mt-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Permitted Reviewers ({allowedPeerNames.length})</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    Click to add/remove specific peers or mentors
                  </span>
                </div>

                {/* Preset Mentors & Peers Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_PEERS_AND_SUPERVISORS.map((item) => {
                    const isSelected = allowedPeerNames.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTogglePeer(item.name)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-500/25 border-indigo-500 text-indigo-200 font-semibold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-zinc-600'}`} />
                        <span>{item.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-indigo-300" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Peer/Instructor */}
                <form onSubmit={handleAddCustomPeer} className="flex gap-2">
                  <input
                    type="text"
                    value={newPeerInput}
                    onChange={(e) => setNewPeerInput(e.target.value)}
                    placeholder="Enter peer or instructor name (e.g., Prof. Sharma)..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newPeerInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Peer</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 2. TOPIC TAGGING FEATURE */}
          <div className="space-y-2 pt-2 border-t border-zinc-850">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Topic Tagging for Campus Discovery</span>
              </label>
              <span className="text-[10px] text-zinc-500">
                {topicTags.length} active tags
              </span>
            </div>

            {/* Current Attached Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              {topicTags.length === 0 ? (
                <span className="text-[11px] text-zinc-500 italic flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-zinc-600" />
                  No tags added yet. Choose from suggestions below or type a custom tag.
                </span>
              ) : (
                topicTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold group animate-in fade-in"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-amber-400/60 hover:text-amber-200 p-0.5 transition"
                      title={`Remove #${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                  #
                </span>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(newTagInput);
                    }
                  }}
                  placeholder="Type topic tag (e.g. Algebra, Physics, Pedagogy) & press Enter..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                disabled={!newTagInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            </div>

            {/* Preset Suggested Topic Tags */}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] text-zinc-500 font-medium">Quick Suggestions:</div>
              <div className="flex flex-wrap gap-1">
                {PRESET_TOPIC_TAGS.map((tag) => {
                  const isAdded = topicTags.some((t) => t.toLowerCase() === tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => (isAdded ? handleRemoveTag(tag) : handleAddTag(tag))}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition flex items-center gap-1 ${
                        isAdded
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span>#{tag}</span>
                      {isAdded ? <Check className="w-2.5 h-2.5 text-amber-400" /> : <Plus className="w-2.5 h-2.5 opacity-60" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
