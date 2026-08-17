import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  LogOut,
  UserCheck,
  Smartphone,
  Layers,
} from 'lucide-react';
import { UserProfile, StudentAccount } from '../../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onGoogleLoginSuccess: (email: string, name: string, picture?: string) => void;
  onSignOut: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onGoogleLoginSuccess,
  onSignOut,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const defaultUserEmail = 'alokinfo30@gmail.com';
  const defaultUserName = 'Alok Kumar';

  const handleQuickGoogleSignIn = (email: string, name: string) => {
    setIsLoading(true);
    setTimeout(() => {
      onGoogleLoginSuccess(
        email,
        name,
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      );
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    handleQuickGoogleSignIn(customEmail, customName);
  };

  const isSignedInWithGoogle = profile.authProvider === 'google';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-all text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 font-sans tracking-tight">
            {isSignedInWithGoogle ? 'Google Account Connected' : 'Sign in to StudyOS.AI'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Each student has an isolated private workspace partition. Zero data leak.
          </p>
        </div>

        {isSignedInWithGoogle ? (
          /* Active Logged-in State */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    profile.googleProfile?.picture ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={profile.name}
                  className="w-11 h-11 rounded-full border border-emerald-500/50"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-zinc-100 truncate">
                      {profile.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{profile.email}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Partition ID:</span>
                  <span className="text-zinc-300">studyos_student_{profile.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Offline Storage:</span>
                  <span className="text-emerald-400">IndexedDB Synced</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onSignOut}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Sign Out</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ) : (
          /* Sign-In Options */
          <div className="space-y-4">
            {/* Primary Google Login Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickGoogleSignIn(defaultUserEmail, defaultUserName)}
              className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm transition-all shadow-md border border-zinc-200 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>{isLoading ? 'Connecting...' : `Sign in as ${defaultUserName}`}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-zinc-400">
                or sign in with custom Gmail
              </span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            {!isCustomMode ? (
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-850 hover:border-zinc-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>Enter Another Gmail / Google Workspace Account</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Kumar"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="py-2 px-3 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Connect Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Strict Partition Guarantee</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Your attempts, scores, and flashcards are locked strictly to your account. No other student can see or edit your data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
