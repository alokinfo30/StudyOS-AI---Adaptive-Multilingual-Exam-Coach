import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { StudentAccount, ExamCategory, LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';

interface StudentSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: StudentAccount[];
  activeStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onCreateStudent: (
    name: string,
    email: string,
    exam: ExamCategory,
    lang: LanguageCode
  ) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentSwitcherModal: React.FC<StudentSwitcherModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activeStudentId,
  onSelectStudent,
  onCreateStudent,
  onDeleteStudent,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newExam, setNewExam] = useState<ExamCategory>('CBSE_10');
  const [newLang, setNewLang] = useState<LanguageCode>('hi');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    onCreateStudent(newName.trim(), newEmail.trim(), newExam, newLang);
    setIsCreating(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        {/* Header with Security & Strict Isolation Notice */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Strict Data Isolation Active
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100 font-sans">
              Switch Student Account
            </h2>
            <p className="text-xs text-zinc-400">
              Each student profile maintains an independent, isolated database for concept mastery, DNA, test attempts, and revision records. Zero cross-student data leakage.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg bg-zinc-800/80"
          >
            ✕
          </button>
        </div>

        {/* Existing Accounts List */}
        {!isCreating ? (
          <div className="space-y-4">
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isActive = acc.id === activeStudentId;
                return (
                  <div
                    key={acc.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectStudent(acc.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl shrink-0">
                        {acc.avatar}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">{acc.name}</span>
                          {isActive && (
                            <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500 text-zinc-950">
                              Active Student
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span>{acc.email}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-amber-400/90">{acc.selectedExam.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="capitalize">{acc.preferredLanguage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                      ) : (
                        <button
                          onClick={() => {
                            onSelectStudent(acc.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                        >
                          Switch
                        </button>
                      )}

                      {accounts.length > 1 && !isActive && (
                        <button
                          onClick={() => onDeleteStudent(acc.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Delete profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-amber-400 hover:bg-zinc-700 transition-all border border-zinc-700"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New Student Profile</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Create New Isolated Student Form */
          <form onSubmit={handleCreateSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Student Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Gupta / Sanya Mehra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Email / Student ID:
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@school.org"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Exam / Target Focus:
                  </label>
                  <select
                    value={newExam}
                    onChange={(e) => setNewExam(e.target.value as ExamCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="CBSE_10">CBSE Class 10</option>
                    <option value="CBSE_12">CBSE Class 12</option>
                    <option value="JEE_MAIN">JEE Main & Advanced</option>
                    <option value="NEET_UG">NEET UG</option>
                    <option value="UP_BOARD_10">UP Board 10</option>
                    <option value="UP_BOARD_12">UP Board 12</option>
                    <option value="CUET">CUET</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Preferred Language:
                  </label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value as LanguageCode)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                A dedicated, encrypted workspace partition will be created for this student. No scores or diagnostic history will be shared with other profiles.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-md"
              >
                Create Isolated Profile ➔
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
