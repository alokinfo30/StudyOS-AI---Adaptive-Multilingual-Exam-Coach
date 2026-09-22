import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Shield,
  ArrowRight,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
} from 'lucide-react';

export interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  studentName?: string;
  expectedCode?: string;
  emailDelivered?: boolean;
  dispatchMessage?: string;
  onVerificationSuccess: (code: string) => void;
  onResendCode: () => Promise<void> | void;
  onInstantVerifyGoogle?: () => void;
  isLoading?: boolean;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  studentName,
  emailDelivered = false,
  dispatchMessage = '',
  onVerificationSuccess,
  onResendCode,
  isLoading = false,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  
  // 10-minute validity timer (600 seconds)
  const TEN_MINUTES_SEC = 600;
  const [secondsLeft, setSecondsLeft] = useState<number>(TEN_MINUTES_SEC);
  
  // 30-second cooldown for resend button to avoid spamming
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setSuccessNotice(null);
      setSecondsLeft(TEN_MINUTES_SEC);
      setResendCooldown(30);

      // Auto-focus first digit box
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // 10-Minute Expiry Countdown Timer
  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setError('Verification code has expired (valid for 10 minutes only). Please regenerate a new code.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isOpen]);

  // Resend Cooldown Countdown Timer
  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown, isOpen]);

  if (!isOpen) return null;

  const isExpired = secondsLeft <= 0;
  const currentCode = digits.join('');

  // Format 10-minute countdown MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleUnifiedInputChange = (val: string) => {
    setError(null);
    setSuccessNotice(null);
    const clean = val.replace(/\D/g, '').slice(0, 6);
    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < clean.length; i++) {
      newDigits[i] = clean[i];
    }
    setDigits(newDigits);
  };

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    setSuccessNotice(null);
    const cleanVal = value.replace(/\D/g, '');

    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split('');
      const newDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal ? cleanVal.slice(-1) : '';
    setDigits(newDigits);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);
    const focusTarget = Math.min(pasteData.length, 5);
    inputRefs.current[focusTarget]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      setError('Verification code has expired (valid for 10 minutes only). Please click "Regenerate Verification Code".');
      return;
    }

    if (currentCode.length < 6) {
      setError('Please enter all 6 digits of the verification code sent to your Gmail.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Backend verification
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: currentCode.trim() }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setError('Verification service unavailable. Please check your network connection.');
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.verified || data.success)) {
        onVerificationSuccess(currentCode);
      } else {
        setError(data.error || 'Wrong verification code. Please check your Gmail and try again.');
      }
    } catch {
      setError('Network error while verifying code. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTriggerResend = async () => {
    if ((resendCooldown > 0 && !isExpired) || isResending) return;
    setIsResending(true);
    setError(null);
    setSuccessNotice(null);
    try {
      await onResendCode();
      setDigits(['', '', '', '', '', '']);
      setSecondsLeft(TEN_MINUTES_SEC);
      setResendCooldown(30);
      setSuccessNotice(`A fresh 6-digit verification code was sent to ${email}. Valid for 10 minutes.`);
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    } catch {
      setError('Failed to regenerate code. Please try again in a few seconds.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      id="email-verification-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading || isVerifying}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close verification modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-100">
                Gmail Verification Code
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
                6 Digits
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Enter the code sent to your registered Gmail account
            </p>
          </div>
        </div>

        {/* Target Email Info Badge */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] text-zinc-400 font-medium">Code Sent to Gmail:</div>
            <div className="text-xs font-semibold text-zinc-200 truncate flex items-center gap-1.5 mt-0.5">
              <span className="truncate text-amber-300 font-mono">{email}</span>
              {studentName && (
                <span className="text-[10px] text-zinc-400 shrink-0 font-normal">
                  ({studentName})
                </span>
              )}
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 shrink-0 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Secure</span>
          </div>
        </div>

        {/* 10-Minute Expiry Countdown Banner */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
            isExpired
              ? 'bg-red-500/10 border-red-500/40 text-red-300'
              : secondsLeft < 120
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-zinc-950 border-zinc-800 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 ${
                isExpired
                  ? 'text-red-400 animate-pulse'
                  : secondsLeft < 120
                  ? 'text-amber-400 animate-pulse'
                  : 'text-amber-400'
              }`}
            />
            <span className="text-xs font-medium">
              {isExpired ? (
                <span className="font-semibold text-red-400">Code Expired</span>
              ) : (
                <>Code valid for <strong>10 minutes</strong></>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500">Remaining:</span>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                isExpired
                  ? 'bg-red-500/20 text-red-300'
                  : secondsLeft < 120
                  ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
          </div>
        </div>

        {/* Email Dispatch & Spam Guidance */}
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <span>
              {dispatchMessage || (
                <>
                  Verification email sent to <strong>{email}</strong>. Please check your <strong>Inbox</strong> or <strong>Spam / Junk folder</strong>.
                </>
              )}
            </span>
          </div>
        </div>

        {/* Success / Info Feedback */}
        {successNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2 text-center">
              Enter 6-Digit Verification Code from Gmail
            </label>

            {/* 6 Digit Input Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  disabled={isLoading || isVerifying || isExpired}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-zinc-950 border transition-all outline-none ${
                    isExpired
                      ? 'border-red-900/50 text-zinc-600 bg-zinc-950/50 cursor-not-allowed'
                      : digit
                      ? 'border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                      : 'border-zinc-800 text-zinc-200 hover:border-zinc-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40'
                  }`}
                  aria-label={`Verification Digit ${idx + 1}`}
                />
              ))}
            </div>

            {/* Direct mobile fallback input */}
            <div className="mt-2.5">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={currentCode}
                disabled={isLoading || isVerifying || isExpired}
                onChange={(e) => handleUnifiedInputChange(e.target.value)}
                placeholder="Or type/paste full 6-digit code here..."
                className="w-full text-center text-xs font-mono py-2 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              id="verification-error-message"
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-300 flex items-start gap-2 animate-shake"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            id="verify-submit-btn"
            disabled={isLoading || isVerifying || currentCode.length < 6 || isExpired}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isVerifying || isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Verifying with Server...</span>
              </>
            ) : isExpired ? (
              <span>Code Expired — Regenerate Below</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Code & Complete Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>

          {/* Regenerate / Resend Code Section */}
          <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
            <span>
              {isExpired ? 'Code expired after 10 min:' : "Didn't receive the email?"}
            </span>
            {resendCooldown > 0 && !isExpired ? (
              <span className="font-mono text-zinc-500 text-[11px]">
                Regenerate in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                id="regenerate-code-btn"
                onClick={handleTriggerResend}
                disabled={isResending}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isExpired ? 'Regenerate Verification Code' : 'Regenerate Code'}</span>
              </button>
            )}
          </div>
        </form>

        {/* Security Assurance */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <Shield className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>Strict Gmail verification: 6-digit code valid for 10 minutes only</span>
        </div>
      </div>
    </div>
  );
};
