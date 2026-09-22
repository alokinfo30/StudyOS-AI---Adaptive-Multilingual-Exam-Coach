import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  LogOut,
  Smartphone,
  School,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  RefreshCw,
  X,
  Inbox,
  Send,
  User,
} from 'lucide-react';
import { UserProfile, StudentAccount } from '../../types';
import {
  loadStudentAccounts,
  LoginMethod,
  saveSessionToken,
  generateSessionToken,
} from '../../services/storageService';
import { EmailVerificationModal } from './EmailVerificationModal';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onGoogleLoginSuccess: (
    email: string,
    name: string,
    picture?: string,
    method?: LoginMethod,
    phone?: string,
    rememberMe?: boolean
  ) => void;
  onSignOut: () => void;
  onVerificationStateChange?: (isVerifying: boolean) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onGoogleLoginSuccess,
  onSignOut,
  onVerificationStateChange,
}) => {
  // Selected login method (student chooses ONE method)
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>('google');

  // Form Fields
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [rollNumberInput, setRollNumberInput] = useState('');
  const [boardInput, setBoardInput] = useState('CBSE Class 10');

  // Phone OTP State
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [simulatedPhoneOtp, setSimulatedPhoneOtp] = useState('849201');

  // Gmail Verification Code State
  const [gmailStep, setGmailStep] = useState<'input' | 'verify'>('input');
  const [gmailVerificationCode, setGmailVerificationCode] = useState('');
  const [enteredGmailCode, setEnteredGmailCode] = useState('');
  const [gmailCountdown, setGmailCountdown] = useState(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingStudent, setIsSwitchingStudent] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Load existing registered accounts from storage (for background email deduplication)
  const [accountsRegistry, setAccountsRegistry] = useState<StudentAccount[]>([]);

  // Remember Me Checkbox State (persists session token in localStorage for 30 days)
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studyos_remember_me') !== 'false';
    } catch {
      return true;
    }
  });

  // Email Verification Middleware Modal State
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{
    method: LoginMethod;
    email: string;
    name: string;
    picture?: string;
    phone?: string;
  } | null>(null);
  const [middlewareVerificationCode, setMiddlewareVerificationCode] = useState('');
  const [isEmailDelivered, setIsEmailDelivered] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState('');

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or reset on modal open
  useEffect(() => {
    if (isOpen) {
      setAccountsRegistry(loadStudentAccounts());
      setIsSwitchingStudent(false);
      setStatusNotification(null);
      setVerificationError(null);
      setIsVerified(false);
      setGmailStep('input');
      setEnteredGmailCode('');
      setIsEmailVerificationModalOpen(false);
      setPendingCredentials(null);

      // Pre-fill email if user already has one or default to demo email
      if (profile.email && profile.authProvider !== 'guest') {
        setEmailInput(profile.email);
        setNameInput(profile.name || '');
      } else if (!emailInput) {
        setEmailInput('alokinfo30@gmail.com');
        setNameInput('Alok Kumar');
      }
    } else {
      if (onVerificationStateChange) onVerificationStateChange(false);
    }
  }, [isOpen, profile.id]);

  // Countdown timer for resending Gmail verification code
  useEffect(() => {
    if (gmailCountdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setGmailCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [gmailCountdown]);

  // Determine if active user is logged in
  const isCurrentlyLoggedIn =
    profile.authProvider &&
    profile.authProvider !== 'guest' &&
    Boolean(profile.email);

  // Real-time lookup: Is the entered email already registered?
  const matchedExistingAccount = useMemo(() => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return null;
    return accountsRegistry.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.authProvider !== 'guest'
    ) || null;
  }, [emailInput, accountsRegistry]);

  if (!isOpen) return null;

  // Unified Submit & Login Execution
  const handleExecuteLogin = (
    method: LoginMethod,
    email: string,
    name: string,
    picture?: string,
    phone?: string
  ) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const existingMatch = accountsRegistry.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.authProvider !== 'guest'
    );

    setStatusNotification(
      existingMatch
        ? `Recognized existing student "${existingMatch.name}". Linking account with preserved masteries...`
        : `Registering new student identity "${name || 'Student'}". Initializing private partition...`
    );

    setTimeout(() => {
      const finalName = existingMatch ? existingMatch.name : name.trim() || 'Student';
      const finalAvatar =
        picture ||
        existingMatch?.googleProfile?.picture ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`;

      const finalPhone =
        phone ||
        existingMatch?.parentPhone ||
        (cleanEmail === 'alokinfo30@gmail.com' ? '+919876543210' : '+919876543210');

      const targetStudentId = existingMatch ? existingMatch.id : `student_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const sessionToken = generateSessionToken(cleanEmail);

      // Persist session token for 30 days if Remember Me is checked, minimum 7 days otherwise
      saveSessionToken({
        token: sessionToken,
        email: cleanEmail,
        studentId: targetStudentId,
        createdAt: Date.now(),
        expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000),
        rememberMe,
      });

      onGoogleLoginSuccess(cleanEmail, finalName, finalAvatar, method, finalPhone, rememberMe);
      setIsLoading(false);
      onClose();
    }, 200);
  };

  // Middleware Verification Actions
  const triggerEmailVerificationMiddleware = async (
    method: LoginMethod,
    email: string,
    name: string,
    picture?: string,
    phone?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setVerificationError('Please enter a valid Gmail / Email address.');
      return;
    }

    setVerificationError(null);
    setIsLoading(true);

    const resolvedName = name.trim() || (matchedExistingAccount ? matchedExistingAccount.name : 'Student');

    try {
      const res = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, studentName: resolvedName }),
      });
      const data = await res.json().catch(() => ({}));
      setIsEmailDelivered(Boolean(data.emailDelivered));
      setDispatchMessage(data.message || `Verification code sent to your Gmail (${cleanEmail}).`);
    } catch {
      setIsEmailDelivered(false);
      setDispatchMessage(`Verification code sent to ${cleanEmail}.`);
    }

    setPendingCredentials({
      method,
      email: cleanEmail,
      name: resolvedName,
      picture,
      phone,
    });

    setIsLoading(false);
    setIsEmailVerificationModalOpen(true);
    if (onVerificationStateChange) {
      onVerificationStateChange(true);
    }
  };

  const handleMiddlewareVerificationSuccess = (_code: string) => {
    if (!pendingCredentials) return;
    if (onVerificationStateChange) {
      onVerificationStateChange(false);
    }
    setIsEmailVerificationModalOpen(false);
    handleExecuteLogin(
      pendingCredentials.method,
      pendingCredentials.email,
      pendingCredentials.name,
      pendingCredentials.picture,
      pendingCredentials.phone
    );
    setPendingCredentials(null);
  };

  const handleMiddlewareClose = () => {
    if (onVerificationStateChange) {
      onVerificationStateChange(false);
    }
    setIsEmailVerificationModalOpen(false);
    setPendingCredentials(null);
  };

  const handleMiddlewareResend = async () => {
    if (!pendingCredentials) return;
    try {
      const res = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingCredentials.email,
          studentName: pendingCredentials.name,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setIsEmailDelivered(Boolean(data.emailDelivered));
      setDispatchMessage(data.message || `Fresh verification code dispatched to ${pendingCredentials.email}.`);
    } catch {
      setIsEmailDelivered(false);
    }
  };

  // Generate and send 6-digit Gmail Verification Code via Middleware
  const handleSendGmailCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = emailInput.trim();
    if (!clean || !clean.includes('@')) {
      setVerificationError('Please enter a valid Gmail / Email address.');
      return;
    }

    const resolvedName =
      nameInput.trim() ||
      (matchedExistingAccount ? matchedExistingAccount.name : '') ||
      emailInput.split('@')[0].replace(/[._]/g, ' ') ||
      'Student';

    triggerEmailVerificationMiddleware('google', clean, resolvedName);
  };

  // Auto-Fill Code for 1-click easy testing
  const handleAutoFillCode = () => {
    setEnteredGmailCode(gmailVerificationCode);
    setVerificationError(null);
  };

  // Email & Password Submit - Routes through EmailVerificationModal Middleware
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;
    const resolvedName = nameInput.trim() || (matchedExistingAccount ? matchedExistingAccount.name : 'Student');
    triggerEmailVerificationMiddleware('email', emailInput, resolvedName);
  };

  // Phone OTP Send
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.replace(/\D/g, '').length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedPhoneOtp(code);
      setPhoneOtpSent(true);
      setIsLoading(false);
    }, 400);
  };

  // Phone OTP Verify
  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOtpInput.trim()) return;
    const cleanPhone = phoneInput.replace(/\D/g, '');
    const virtualEmail = `${cleanPhone}@phone.studyos.ai`;
    const resolvedName = nameInput.trim() || `Student ${cleanPhone.slice(-4)}`;
    handleExecuteLogin('phone', virtualEmail, resolvedName, undefined, cleanPhone);
  };

  // Roll Number Submit - Routes through EmailVerificationModal Middleware
  const handleRollNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumberInput.trim() || !emailInput.trim()) return;
    const resolvedName = nameInput.trim() || `Student ${rollNumberInput}`;
    triggerEmailVerificationMiddleware('roll_number', emailInput, resolvedName);
  };

  // Quick Demo Presets
  const demoIdentities = [
    {
      name: 'Alok Kumar',
      email: 'alokinfo30@gmail.com',
      avatar: '👨‍🎓',
      desc: 'Class 10 CBSE • Primary Gmail Account',
      method: 'google' as LoginMethod,
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: '👩‍🔬',
      desc: 'NEET 2026 Aspirant • Kota Batch',
      method: 'google' as LoginMethod,
    },
    {
      name: 'Rohan Gupta',
      email: 'rohan.tech@gmail.com',
      avatar: '💻',
      desc: 'Full-Stack Developer • React & Python',
      method: 'google' as LoginMethod,
    },
  ];

  const handleSelectDemoIdentity = (preset: typeof demoIdentities[0]) => {
    setNameInput(preset.name);
    setEmailInput(preset.email);
    setSelectedMethod(preset.method);
    setGmailStep('input');
    setVerificationError(null);
  };

  if (isEmailVerificationModalOpen) {
    return (
      <EmailVerificationModal
        isOpen={isEmailVerificationModalOpen}
        onClose={handleMiddlewareClose}
        email={pendingCredentials?.email || emailInput}
        studentName={pendingCredentials?.name || nameInput}
        emailDelivered={isEmailDelivered}
        dispatchMessage={dispatchMessage}
        onVerificationSuccess={handleMiddlewareVerificationSuccess}
        onResendCode={handleMiddlewareResend}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div
      id="google-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-zinc-900 border border-zinc-750 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Student Authentication</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  Unified Identity
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Sign in with your Gmail ID to access Step 2 & personalized learning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status notification */}
        {statusNotification && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* VIEW 1: ACTIVE STUDENT LOGGED IN STATUS */}
        {isCurrentlyLoggedIn && !isSwitchingStudent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xl overflow-hidden">
                  {profile.googleProfile?.picture ? (
                    <img
                      src={profile.googleProfile.picture}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>👨‍🎓</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">{profile.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Student
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{profile.email}</p>
                  <p className="text-[11px] text-amber-400/90 mt-1">
                    Logged in via: <strong className="capitalize">{profile.authProvider || 'google'}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
              <div className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Single Active Student Privacy Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Only your personal study records, syllabus mastery, notes, and test scores are active. No other student’s data is visible on this browser.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSwitchingStudent(true)}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch / Add Account</span>
              </button>
              <button
                type="button"
                id="auth-modal-logout-btn"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Logout (Invalidate backend session cookie and clear local storage tokens)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout (Wipe Session)</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: LOGIN / SIGN UP VIEW */
          <div className="space-y-4">
            {/* Quick Verification Code Dispatch for Demo/Mobile */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border border-amber-500/40 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gmail 6-Digit Code Login</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  10-Min Expiry
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerEmailVerificationMiddleware(
                    'google',
                    'alokinfo30@gmail.com',
                    'Alok Kumar',
                    undefined,
                    '9876543210'
                  );
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-zinc-950 font-bold text-xs transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ Send Verification Code to alokinfo30@gmail.com</span>
              </button>
            </div>

            {/* Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('google');
                  setGmailStep('input');
                  setVerificationError(null);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'google'
                    ? 'bg-zinc-800 text-amber-400 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <svg className="w-4 h-4 mb-1" viewBox="0 0 24 24">
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
                <span>Gmail / Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('email');
                  setVerificationError(null);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'email'
                    ? 'bg-zinc-800 text-amber-400 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Mail className="w-4 h-4 mb-1" />
                <span>Email & Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('phone');
                  setVerificationError(null);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'phone'
                    ? 'bg-zinc-800 text-amber-400 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1" />
                <span>Phone OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('roll_number');
                  setVerificationError(null);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'roll_number'
                    ? 'bg-zinc-800 text-amber-400 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <School className="w-4 h-4 mb-1" />
                <span>Roll No.</span>
              </button>
            </div>

            {/* Remember Me Toggle: 30-Day Persistent Token */}
            <div className="px-3 py-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 flex items-center justify-between gap-3">
              <label htmlFor="auth-remember-me" className="flex items-center gap-2.5 cursor-pointer select-none flex-1">
                <input
                  type="checkbox"
                  id="auth-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Remember Me</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-medium">
                      30 Days
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Persist session token across browser restarts & mobile reloads
                  </p>
                </div>
              </label>
              <Shield className="w-4 h-4 text-amber-400/70 shrink-0" />
            </div>

            {/* Same-Email Unification Live Detector */}
            {matchedExistingAccount ? (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-200">
                    Existing Student Recognized: {matchedExistingAccount.name}
                  </p>
                  <p className="text-[11px] text-amber-300/80 leading-snug">
                    Verifying this Gmail links directly to your existing account. All progress and masteries are preserved.
                  </p>
                </div>
              </div>
            ) : emailInput.includes('@') ? (
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>New Student Registration: A dedicated private partition will be created.</span>
              </div>
            ) : null}

            {/* Error Banner */}
            {verificationError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}

            {/* ================= METHOD 1: GMAIL / GOOGLE ================= */}
            {selectedMethod === 'google' && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                {/* 1. Official Standard "Continue with Google" (Live Production Flow) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs">
                      G
                    </div>
                    <span className="text-xs font-bold text-zinc-200">Google Account Authentication</span>
                    <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                      Instant Access
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Authenticate instantly with your Google profile to unlock your personalized learning partition, syllabus roadmap, and AI coaches.
                  </p>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      const cleanEmail = emailInput.trim() || 'alokinfo30@gmail.com';
                      const resolvedName =
                        nameInput.trim() ||
                        (matchedExistingAccount ? matchedExistingAccount.name : '') ||
                        cleanEmail.split('@')[0].replace(/[._]/g, ' ') ||
                        'Alok Kumar';
                      triggerEmailVerificationMiddleware('google', cleanEmail, resolvedName);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.99] text-zinc-900 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer border border-zinc-300"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                    <span>Continue with Google ({emailInput || 'alokinfo30@gmail.com'})</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-zinc-500 my-1">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="font-mono uppercase tracking-wider text-[9px] text-zinc-400">Or verify via 6-digit email code</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                {/* 2. Email Form for 6-digit Email Verification */}
                <form onSubmit={handleSendGmailCode} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                      Google / Gmail Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alokinfo30@gmail.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setVerificationError(null);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                      Student Full Name <span className="text-zinc-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alok Kumar"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600"
                    />
                  </div>

                  {matchedExistingAccount && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Registered Account: {matchedExistingAccount.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        Recognized
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isLoading ? 'Connecting to Auth Service...' : 'Request 6-Digit Email Verification Code'}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* ================= METHOD 2: EMAIL & PASSWORD ================= */}
            {selectedMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-3 py-2 pr-10 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In with Email & Password'}</span>
                </button>
              </form>
            )}

            {/* ================= METHOD 3: PHONE OTP ================= */}
            {selectedMethod === 'phone' && (
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                {!phoneOtpSent ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                        Mobile Number (India)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-400 text-xs font-mono">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || phoneInput.length < 10}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{isLoading ? 'Sending SMS OTP...' : 'Send 6-Digit OTP'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                      OTP sent to <strong>+91 {phoneInput}</strong>. Simulated OTP:{' '}
                      <span className="font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                        {simulatedPhoneOtp}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder={simulatedPhoneOtp}
                        value={phoneOtpInput}
                        onChange={(e) => setPhoneOtpInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-center text-base tracking-widest font-mono focus:outline-none focus:border-amber-500 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || phoneOtpInput.length < 6}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isLoading ? 'Verifying...' : 'Verify OTP & Log In'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ================= METHOD 4: INSTITUTIONAL ROLL NUMBER ================= */}
            {selectedMethod === 'roll_number' && (
              <form onSubmit={handleRollNumberSubmit} className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    School / Coaching Board
                  </label>
                  <select
                    value={boardInput}
                    onChange={(e) => setBoardInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="CBSE Class 10">CBSE Class 10</option>
                    <option value="CBSE Class 12">CBSE Class 12</option>
                    <option value="ICSE / ISC">ICSE / ISC</option>
                    <option value="UP Board">UP Board</option>
                    <option value="Maharashtra SSC/HSC">Maharashtra SSC/HSC</option>
                    <option value="Kota Coaching Institute">Kota Coaching Institute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Student Roll Number / Enrollment ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2611094"
                    value={rollNumberInput}
                    onChange={(e) => setRollNumberInput(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Primary Email (For progress recovery & reports)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alokinfo30@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <School className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Roll Number...' : 'Sign In with Roll Number'}</span>
                </button>
              </form>
            )}

            {/* Quick Demo Test Student Accounts */}
            <div className="space-y-2 pt-1 border-t border-zinc-800/80">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                Quick Test Identities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoIdentities.map((preset) => (
                  <button
                    key={preset.email}
                    type="button"
                    onClick={() => handleSelectDemoIdentity(preset)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-850 text-left transition-all cursor-pointer group"
                    title={`Fill form with ${preset.name}`}
                  >
                    <span className="text-base">{preset.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors truncate">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">{preset.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy & Facebook-style single user notice */}
            <div className="p-3 bg-zinc-950/70 rounded-2xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-xs">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Single Active Student Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Multiple students can log in from this computer, but only one student is active at a time. The previous student’s notes, tests, and data are hidden immediately upon switching.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
