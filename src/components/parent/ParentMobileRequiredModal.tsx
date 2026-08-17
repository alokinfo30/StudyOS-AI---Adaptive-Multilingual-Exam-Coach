import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Globe,
  Bell,
  X,
} from 'lucide-react';
import { UserProfile, LanguageCode, StudentDNA, ConceptMastery } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { generateLocalizedParentMessage } from '../../utils/parentReportLocalization';

interface ParentMobileRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (parentPhone: string, parentName: string, parentLanguage: LanguageCode) => void;
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
  targetActionLabel?: string; // e.g. "Interactive NCERT Lesson" or "Daily Practice Drill"
}

export const ParentMobileRequiredModal: React.FC<ParentMobileRequiredModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  profile,
  dna,
  masteries,
  targetActionLabel = 'Learning Modules',
}) => {
  const [parentPhone, setParentPhone] = useState(profile.parentPhone || '');
  const [parentName, setParentName] = useState(profile.parentName || '');
  const [parentLang, setParentLang] = useState<LanguageCode>(
    profile.parentPreferredLanguage || profile.preferredLanguage || 'hi'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [enableAutoReports, setEnableAutoReports] = useState(true);

  if (!isOpen) return null;

  // Real-time live localized message preview
  const previewMessage = generateLocalizedParentMessage({
    profile: {
      ...profile,
      parentPhone: parentPhone || '+91 98765 43210',
      parentName: parentName || 'Guardian',
      parentPreferredLanguage: parentLang,
    },
    dna,
    masteries,
    reportType: 'daily_summary',
    targetLanguage: parentLang,
  });

  const selectedLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === parentLang) || SUPPORTED_LANGUAGES[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = parentPhone.trim();

    // Validation: Require at least 10 digits
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number (e.g. +91 98765 43210).');
      return;
    }

    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
    const cleanParentName = parentName.trim() || 'Parent / Guardian';

    setErrorMsg('');
    onConfirm(formattedPhone, cleanParentName, parentLang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Optional Close / Skip Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 p-2 rounded-xl hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-zinc-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center text-xl font-bold shrink-0 shadow-lg shadow-amber-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Guardian Sync Required
              </span>
              <span className="text-xs text-zinc-400 font-mono">100% Student Privacy</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100 font-sans">
              Set Parent Mobile Number Before Learning
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              StudyOS AI automatically sends daily study streak, practice scores, and concept mastery updates directly to parents as text messages in their preferred local language.
            </p>
          </div>
        </div>

        {/* The Mandatory Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Parent Mobile Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-300 font-bold flex items-center justify-between">
              <span>Parent / Guardian Mobile Number *</span>
              <span className="text-[10px] text-amber-400 font-normal">Auto SMS / WhatsApp</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                autoFocus
                value={parentPhone}
                onChange={(e) => {
                  setParentPhone(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none transition-all shadow-inner"
              />
            </div>
            <p className="text-[11px] text-zinc-400">
              Enter Indian 10-digit number (e.g. 9876543210 or +91 98765 43210).
            </p>
          </div>

          {/* Parent Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-300 font-bold">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Ramesh Kumar / Sunita Devi"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs focus:outline-none transition-all"
            />
          </div>

          {/* Parent's Preferred Local Language */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-zinc-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Language for Parent SMS Reports:
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Selected: {selectedLangObj.nativeName}
              </span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setParentLang(lang.code)}
                  className={`p-2 rounded-xl border text-center transition-all text-xs flex flex-col items-center justify-center ${
                    parentLang === lang.code
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-semibold">{lang.nativeName}</span>
                  <span className="text-[10px] text-zinc-500">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Dispatch Checkbox */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/90 flex items-start gap-3">
            <input
              type="checkbox"
              id="autoReportToggle"
              checked={enableAutoReports}
              onChange={(e) => setEnableAutoReports(e.target.checked)}
              className="mt-1 rounded text-amber-500 focus:ring-amber-500 border-zinc-700 bg-zinc-900 cursor-pointer"
            />
            <label htmlFor="autoReportToggle" className="text-xs text-zinc-300 cursor-pointer space-y-0.5">
              <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
                Automatically dispatch text messages after study sessions
              </span>
              <span className="block text-[11px] text-zinc-400">
                Sends automated streak notifications & weekly mastery summaries directly in {selectedLangObj.nativeName}.
              </span>
            </label>
          </div>

          {/* Live Message Preview in Local Language */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-amber-400" />
                Live SMS / WhatsApp Preview ({selectedLangObj.nativeName}):
              </span>
              <span className="text-[10px] font-mono text-emerald-400">✓ Localized Format</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto no-scrollbar select-all">
              {previewMessage}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
            >
              <span>Save Parent Number & Continue to {targetActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 text-center transition-colors"
            >
              Skip for now (Preview as Guest)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
