import React, { useState } from 'react';
import { 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Download, 
  FileText, 
  AlertCircle,
  TrendingUp,
  School,
  Sparkles
} from 'lucide-react';
import { SlateDiagnosis, StudentProfile } from '../../types/akshar';

interface EdgeSyncCenterProps {
  diagnoses: SlateDiagnosis[];
  students: StudentProfile[];
  isOnline: boolean;
  onToggleOnline: () => void;
  onSyncBatch: () => Promise<void>;
  isSyncing: boolean;
  chalkMode: boolean;
}

export const EdgeSyncCenter: React.FC<EdgeSyncCenterProps> = ({
  diagnoses,
  students,
  isOnline,
  onToggleOnline,
  onSyncBatch,
  isSyncing,
  chalkMode,
}) => {
  const [copyStatus, setCopyStatus] = useState(false);

  const pendingItems = diagnoses.filter((d) => d.syncStatus === 'pending');
  const syncedItems = diagnoses.filter((d) => d.syncStatus === 'synced');

  // Generate WhatsApp / BEO NIPUN FLN Summary Report
  const generateDailyReport = (): string => {
    const totalAssessed = diagnoses.length;
    const band1Count = students.filter((s) => s.currentBand === 1).length;
    const band2Count = students.filter((s) => s.currentBand === 2).length;
    const band3Count = students.filter((s) => s.currentBand === 3).length;
    const avgAccuracy = Math.round(
      students.reduce((acc, s) => acc + s.phonicsAccuracy, 0) / (students.length || 1)
    );

    return `*अक्षरसेतु - दैनिक निपुण FLN प्रगति रिपोर्ट*
🏫 *प्राथमिक विद्यालय पिपरही* (संयुक्त वर्ग १-३)
📅 दिनांक: ${new Date().toLocaleDateString('hi-IN')}
👩‍🏫 शिक्षक: सरिता देवी

📊 *कक्षा सारांश:*
• कुल नामांकित: ${students.length} विद्यार्थी
• आज उपस्थित: ${students.filter((s) => s.attendanceToday).length}
• औसत ध्वन्यात्मक शुद्धता: ${avgAccuracy}%

👥 *TaRL समूह विभाजन (Teaching at Right Level):*
• दल १ (अक्षर/मात्रा साधक): ${band1Count} छात्र
• दल २ (शब्द/संयोजन खोजी): ${band2Count} छात्र
• दल ३ (कहानी धाराप्रवाह पाठक): ${band3Count} छात्र

📸 *स्लेट दृष्टि निदान सारांश:*
• कुल जांची गई स्लेटें: ${totalAssessed}
• प्रमुख सुधारात्मक बिंदु: देवनागरी 'ब' vs 'व' ध्वन्यात्मक अंतर व हासिल जोड़

_रिपोर्ट अक्षरसेतु ऑफलाइन एज इंजन द्वारा स्वतः निर्मित_`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateDailyReport());
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2500);
  };

  return (
    <div className={`space-y-6 ${chalkMode ? 'font-sans' : ''}`}>
      {/* Banner */}
      <div className="rounded-xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-serif">
                एज-फर्स्ट व अतुल्यकालिक सिंक केंद्र (Edge-First & Asynchronous Sync)
              </h2>
              <p className="text-xs text-zinc-400">
                दूरस्थ ग्रामीण विद्यालयों में बिना इंटरनेट के भी स्लेट निदान, वाणी सेतु व TaRL विभाजन सुचारु रूप से चलता है। सभी डेटा शिक्षक के फोन के लोकल स्टोरेज में सुरक्षित रहता है और इंटरनेट मिलने पर बैच सिंक होता है।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleOnline}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              <span>{isOnline ? 'क्लाउड सिंक चालू' : 'ऑफलाइन मोड अनुकरण'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>स्थानीय रूप से संग्रहीत</span>
            <Database className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {diagnoses.length} <span className="text-xs text-zinc-400 font-sans">निदान</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            ब्राउज़र IndexedDB / LocalStorage में सुरक्षित
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>सिंक हेतु प्रतीक्षारत (Pending Sync)</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            {pendingItems.length} <span className="text-xs text-amber-400 font-sans">रिकॉर्ड</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            नेटवर्क मिलते ही स्वतः सर्वर पर प्रेषित होंगे
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>क्लाउड नोड स्थिति</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">
              {syncedItems.length} <span className="text-xs text-emerald-400 font-sans">सिंक पूर्ण</span>
            </div>
          </div>

          <button
            onClick={onSyncBatch}
            disabled={isSyncing || pendingItems.length === 0}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-emerald-500 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'सिंक हो रहा है...' : 'अभी बैच सिंक करें'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Queue List (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white font-serif">
                स्थानीय एज कतार (Offline Evaluation Queue)
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                {pendingItems.length} लंबित
              </span>
            </div>

            {diagnoses.length > 0 ? (
              <div className="space-y-2">
                {diagnoses.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950 p-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-200">{item.childName}</span>
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                          कक्षा {item.grade}
                        </span>
                        <span className="text-amber-400 font-serif text-[11px]">
                          {item.errorSubtype}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        पहचाना: "{item.detectedText}" • शुद्धता: {item.accuracyScore}%
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.syncStatus === 'synced'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.syncStatus === 'synced' ? 'सिंक पूर्ण ✓' : 'एज कतार में'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-8">
                कोई स्लेट मूल्यांकन अभी कतार में नहीं है। 'स्लेट निदान' टैब में जाकर पहली स्लेट का विश्लेषण करें।
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp & BEO Report Export Card (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-serif">
                  दैनिक निपुण FLN रिपोर्ट (WhatsApp Export)
                </h3>
              </div>
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-zinc-700 transition"
              >
                <Share2 className="h-3 w-3" />
                <span>{copyStatus ? 'कॉपी हो गया! ✓' : 'कॉपी करें'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-zinc-700/60 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed shadow-inner">
              {generateDailyReport()}
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              * यह रिपोर्ट एक क्लिक में कॉपी करके खंड शिक्षा अधिकारी (BEO) या संकुल शिक्षक व्हाट्सएप ग्रुप में साझा की जा सकती है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
