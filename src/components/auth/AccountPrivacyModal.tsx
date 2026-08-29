import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Smartphone,
  CheckCircle2,
  HardDrive,
  Wifi,
  LogOut,
  Sparkles,
  Key,
  Palette,
  Check,
} from 'lucide-react';
import { UserProfile, LanguageCode, ExamCategory, EducationBoard, CustomAccentColor } from '../../types';
import { ACCENT_COLOR_PALETTES, applyAccentColorToDocument } from '../../utils/themeUtils';

interface AccountPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenGoogleAuth: () => void;
}

export const AccountPrivacyModal: React.FC<AccountPrivacyModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenGoogleAuth,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [parentPhone, setParentPhone] = useState(profile.parentPhone || '+919876543210');
  const [selectedAccent, setSelectedAccent] = useState<CustomAccentColor>(profile.accentColor || 'amber');
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccent = (color: CustomAccentColor) => {
    setSelectedAccent(color);
    applyAccentColorToDocument(color);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...profile,
      name,
      email,
      parentPhone,
      accentColor: selectedAccent,
    };
    applyAccentColorToDocument(selectedAccent);
    onUpdateProfile(updatedProfile);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-all text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-sans">
                My Account & Data Privacy
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Private
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Your test attempts, learning DNA, and flashcards are locked strictly to your session.
            </p>
          </div>
        </div>

        {/* Privacy & Isolation Guarantee Banner */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Private Partition ID:
            </span>
            <span className="text-zinc-200 font-bold">studyos_student_{profile.id || 'alok'}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              Storage Engine:
            </span>
            <span className="text-emerald-400">IndexedDB Synced (Offline Ready)</span>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
            🛡️ <strong>Student Privacy Promise:</strong> No other student can view your performance, streaks, or mistaken questions on this device.
          </div>
        </div>

        {/* Google / Gmail Status */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200">
                {profile.authProvider === 'google' ? 'Google Account Connected' : 'Guest Account'}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">{profile.email}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGoogleAuth();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            {profile.authProvider === 'google' ? 'Manage' : 'Sign in'}
          </button>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Student Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Parent Mobile Number (for WhatsApp/SMS reports)
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Custom Accent Color Palette Selector */}
          <div className="pt-2 border-t border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-300 font-bold">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom UI Accent Theme</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-400">
                {ACCENT_COLOR_PALETTES[selectedAccent]?.name}
              </span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Object.keys(ACCENT_COLOR_PALETTES) as CustomAccentColor[]).map((colorKey) => {
                const palette = ACCENT_COLOR_PALETTES[colorKey];
                const isSelected = selectedAccent === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => handleSelectAccent(colorKey)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center group ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-500 shadow-md ring-2'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                    }`}
                    style={{
                      borderColor: isSelected ? palette.hex : undefined,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shadow-inner transition-transform group-hover:scale-110"
                      style={{ backgroundColor: palette.hex }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-black font-extrabold stroke-[3]" />}
                    </div>
                    <span className="text-[10px] font-medium text-zinc-300 capitalize truncate w-full">
                      {colorKey}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-zinc-400 font-sans leading-tight">
              Selected accent is applied instantly across primary buttons, highlights, badges, and glowing borders.
            </p>
          </div>

          {savedToast && (
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile preferences saved securely to IndexedDB!</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
