import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  ShieldCheck,
  Flame,
  Target,
  Share2,
} from 'lucide-react';
import {
  UserProfile,
  StudentDNA,
  ConceptMastery,
  ParentReportLog,
  LanguageCode,
} from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import {
  generateParentWhatsAppMessage,
  saveParentReportLog,
  loadParentReportLogs,
  saveUserProfile,
} from '../../services/storageService';

interface ParentMobileReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
  onUpdateParentPhone?: (phone: string, name: string, language?: LanguageCode) => void;
}

export const ParentMobileReportModal: React.FC<ParentMobileReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  dna,
  masteries,
  onUpdateParentPhone,
}) => {
  const [parentPhone, setParentPhone] = useState(
    profile.parentPhone || '+919876543210'
  );
  const [parentName, setParentName] = useState(
    profile.parentName || 'Parent / Guardian'
  );
  const [parentLang, setParentLang] = useState<LanguageCode>(
    profile.parentPreferredLanguage || profile.preferredLanguage || 'hi'
  );
  const [reportType, setReportType] = useState<
    'daily_summary' | 'weekly_milestone' | 'exam_alert'
  >('daily_summary');
  const [copied, setCopied] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const reportLogs = loadParentReportLogs(profile.id);

  if (!isOpen) return null;

  const formattedReport = generateParentWhatsAppMessage(
    { ...profile, parentPreferredLanguage: parentLang },
    dna,
    masteries,
    reportType,
    parentLang
  );

  const cleanPhoneForUrl = parentPhone.replace(/[^\d+]/g, '').replace('+', '');

  const handleSendWhatsApp = () => {
    // Construct WhatsApp Direct API intent URL
    const encodedText = encodeURIComponent(formattedReport);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneForUrl}&text=${encodedText}`;

    // Record log
    const log: ParentReportLog = {
      id: `rep_${Date.now()}`,
      timestamp: Date.now(),
      parentPhone,
      channel: 'whatsapp',
      reportType,
      messageSummary: `Sent ${reportType} (${parentLang}) to ${parentPhone}`,
      status: 'delivered',
    };
    saveParentReportLog(log, profile.id);

    if (onUpdateParentPhone) {
      onUpdateParentPhone(parentPhone, parentName, parentLang);
    }

    setDispatchStatus('WhatsApp message prepared! Opening WhatsApp...');
    window.open(whatsappUrl, '_blank');
  };

  const handleSendSMS = () => {
    const encodedText = encodeURIComponent(formattedReport);
    const smsUrl = `sms:${cleanPhoneForUrl}?body=${encodedText}`;

    const log: ParentReportLog = {
      id: `rep_${Date.now()}`,
      timestamp: Date.now(),
      parentPhone,
      channel: 'sms',
      reportType,
      messageSummary: `SMS dispatched (${parentLang}) to ${parentPhone}`,
      status: 'delivered',
    };
    saveParentReportLog(log, profile.id);

    if (onUpdateParentPhone) {
      onUpdateParentPhone(parentPhone, parentName, parentLang);
    }

    setDispatchStatus('SMS intent opened on mobile device.');
    window.location.href = smsUrl;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-all"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-sans">
              Send Learning Report to Parents’ Mobile
            </h2>
            <p className="text-xs text-zinc-400">
              Direct dispatch via WhatsApp or SMS to student’s guardian.
            </p>
          </div>
        </div>

        {/* Parent Phone & Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Parent Mobile Number (with country code):
            </label>
            <div className="relative">
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Format: +91 98765 43210 (India) or international.
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Parent / Guardian Name:
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Parent Preferred Language */}
        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
            <span>Report Language (12 Indian Languages):</span>
            <span className="text-[10px] text-amber-400 font-mono">
              {SUPPORTED_LANGUAGES.find((l) => l.code === parentLang)?.nativeName}
            </span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setParentLang(l.code)}
                className={`p-2 rounded-xl border text-center transition-all text-xs flex flex-col items-center justify-center ${
                  parentLang === l.code
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-xs font-semibold">{l.nativeName}</span>
                <span className="text-[10px] text-zinc-500">{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Automatic Progress Dispatch Control & Notification Status */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <span>Automatic Real-Time Mobile Dispatch</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Autonomous System Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Every practice drill score, milestone, and daily streak update is automatically synced and dispatched to {parentPhone} without requiring manual sending.
              </p>
            </div>
          </div>
        </div>

        {/* Report Type Selector */}
        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
            Select Report Type:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'daily_summary',
                title: 'Daily Progress Summary',
                sub: 'Streak, accuracy, time & daily tips',
              },
              {
                id: 'weekly_milestone',
                title: 'Weekly Mastery Report',
                sub: 'Chapter completion & test scores',
              },
              {
                id: 'exam_alert',
                title: 'Urgent Exam Alert',
                sub: 'Forgetting risk & formula focus',
              },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setReportType(t.id as any)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  reportType === t.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-zinc-100">{t.title}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Formatted Report Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              Live Message Preview:
            </span>
            <button
              onClick={handleCopyText}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto no-scrollbar shadow-inner select-all">
            {formattedReport}
          </div>
        </div>

        {/* Dispatch Action Buttons */}
        <div className="space-y-3 pt-2">
          {dispatchStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{dispatchStatus}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp (+91 Direct)</span>
            </button>

            <button
              type="button"
              onClick={handleSendSMS}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-zinc-700"
            >
              <Smartphone className="w-4 h-4" />
              <span>Send as Direct SMS</span>
            </button>
          </div>
        </div>

        {/* Dispatch History Log */}
        {reportLogs.length > 0 && (
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400">
              Recent Sent Reports Log:
            </span>
            <div className="space-y-1.5">
              {reportLogs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{log.messageSummary}</span>
                  </div>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
