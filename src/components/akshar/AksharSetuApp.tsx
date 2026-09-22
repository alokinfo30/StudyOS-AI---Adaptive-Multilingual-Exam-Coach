import React, { useState, useEffect } from 'react';
import { AksharNavbar } from './AksharNavbar';
import { SnapDiagnoseView } from './SnapDiagnoseView';
import { OralBridgeView } from './OralBridgeView';
import { TaRLGroupingView } from './TaRLGroupingView';
import { DecodableReadersView } from './DecodableReadersView';
import { EdgeSyncCenter } from './EdgeSyncCenter';
import { Dialect, SlateDiagnosis, StudentProfile, TaRLBand } from '../../types/akshar';
import { INITIAL_STUDENTS_ROSTER, SAMPLE_SLATES } from '../../data/aksharData';

interface AksharSetuAppProps {
  onBackToStudyOS?: () => void;
}

export const AksharSetuApp: React.FC<AksharSetuAppProps> = ({ onBackToStudyOS }) => {
  // Navigation & Dialect State
  const [activeTab, setActiveTab] = useState<'snap' | 'oral' | 'tarl' | 'readers' | 'sync'>('snap');
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('bhojpuri');
  
  // High-contrast Outdoor Chalkboard Mode
  const [chalkMode, setChalkMode] = useState<boolean>(false);
  
  // Audio Playback Speed (0.8x for clear phonics)
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  // Network & Edge Sync State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Classroom Roster State (Local Edge Persistence)
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('akshar_students_roster');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDENTS_ROSTER;
  });

  // Diagnoses Queue State
  const [diagnoses, setDiagnoses] = useState<SlateDiagnosis[]>(() => {
    try {
      const saved = localStorage.getItem('akshar_evaluations_queue');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed with initial realistic evaluation
    return [
      {
        id: 'diag_init_1',
        childName: 'आरव कुमार',
        grade: 1,
        dialect: 'bhojpuri',
        subject: 'hindi_fln',
        detectedText: 'बकील बाबू',
        errorType: 'phonetic_dialectal',
        errorSubtype: 'मातृबोली ध्वन्यात्मक भ्रम (व ➜ ब)',
        accuracyScore: 68,
        boundingBoxes: [
          { x: 20, y: 35, width: 28, height: 40, label: "त्रुटि: 'ब' लिखा गया 'व' के स्थान पर", severity: 'critical' }
        ],
        rootMisconception: "भोजपुरी में 'व' ध्वनि का स्वाभाविक रूपांतरण 'ब' में होता है (उदा. वकील ➜ बकील, वर्षा ➜ बरखा)। बच्चा अपनी बोलचाल की ध्वनि को यथावत लिख रहा है।",
        remediationTip1Min: "खड़िया से स्लेट पर पहले बिना पेट कटी गोल आकृति (व) बनवाएँ। बच्चे को बताएँ कि 'वकील' और 'वर्षा' में पेट नहीं कटता, होंठ गोल होते हैं।",
        recommendedTaRLBand: 1,
        audioBridgeScript: "शाबाश बबुआ! रउआ बहुत नीक लिखनी। वकील बाबू में पेट ना काटल जाला, गोल 'व' बनावल जाला। बोलब 'वकील'।",
        timestamp: Date.now() - 3600000,
        syncStatus: 'synced',
      }
    ];
  });

  // Save changes to localStorage for offline durability
  useEffect(() => {
    try {
      localStorage.setItem('akshar_students_roster', JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('akshar_evaluations_queue', JSON.stringify(diagnoses));
    } catch {}
  }, [diagnoses]);

  // Handle new diagnosis from Snap & Diagnose
  const handleSaveDiagnosis = (newDiag: SlateDiagnosis) => {
    setDiagnoses((prev) => [newDiag, ...prev]);

    // Update child's score & record in roster
    setStudents((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase() === newDiag.childName.toLowerCase()) {
          return {
            ...s,
            phonicsAccuracy: newDiag.accuracyScore,
            currentBand: newDiag.recommendedTaRLBand as TaRLBand,
            notes: newDiag.errorSubtype,
          };
        }
        return s;
      })
    );
  };

  // 1-Click Move Student to Band
  const handleMoveStudent = (studentId: string, newBand: TaRLBand) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, currentBand: newBand } : s))
    );
  };

  const handleAssignByName = (childName: string, band: 1 | 2 | 3) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.name.toLowerCase() === childName.toLowerCase()
          ? { ...s, currentBand: band as TaRLBand }
          : s
      )
    );
  };

  // Batch Sync Handler
  const handleSyncBatch = async () => {
    setIsSyncing(true);
    try {
      const pending = diagnoses.filter((d) => d.syncStatus === 'pending');
      const response = await fetch('/api/akshar/sync-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluations: pending,
          deviceMetadata: {
            appVersion: '1.4.0',
            school: 'प्राथमिक विद्यालय पिपरही',
            gradeCluster: '1-3',
            syncTimestamp: Date.now(),
          },
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        // Mark all as synced
        setDiagnoses((prev) =>
          prev.map((d) => ({ ...d, syncStatus: 'synced' as const }))
        );
      }
    } catch (err: any) {
      console.warn('Sync failed, items remain queued in Edge:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingSyncCount = diagnoses.filter((d) => d.syncStatus === 'pending').length;

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 ${chalkMode ? 'selection:bg-yellow-400 selection:text-black' : ''}`}>
      {/* Navbar with Dialect, Sync, Chalk & Phonics controls */}
      <AksharNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedDialect={selectedDialect}
        onSelectDialect={setSelectedDialect}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        pendingSyncCount={pendingSyncCount}
        onSyncNow={handleSyncBatch}
        isSyncing={isSyncing}
        chalkMode={chalkMode}
        onToggleChalkMode={() => setChalkMode(!chalkMode)}
        speechRate={speechRate}
        onToggleSpeechRate={() => setSpeechRate(speechRate === 0.85 ? 1.0 : speechRate === 1.0 ? 0.7 : 0.85)}
        onBackToStudyOS={onBackToStudyOS}
      />

      {/* Main Classroom Workspace Container */}
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
        {activeTab === 'snap' && (
          <SnapDiagnoseView
            currentDialect={selectedDialect}
            onSaveDiagnosis={handleSaveDiagnosis}
            onAssignToBand={handleAssignByName}
            chalkMode={chalkMode}
            speechRate={speechRate}
          />
        )}

        {activeTab === 'oral' && (
          <OralBridgeView
            currentDialect={selectedDialect}
            onSelectDialect={setSelectedDialect}
            chalkMode={chalkMode}
            speechRate={speechRate}
          />
        )}

        {activeTab === 'tarl' && (
          <TaRLGroupingView
            students={students}
            onMoveStudent={handleMoveStudent}
            currentDialect={selectedDialect}
            chalkMode={chalkMode}
          />
        )}

        {activeTab === 'readers' && (
          <DecodableReadersView
            currentDialect={selectedDialect}
            chalkMode={chalkMode}
            speechRate={speechRate}
          />
        )}

        {activeTab === 'sync' && (
          <EdgeSyncCenter
            diagnoses={diagnoses}
            students={students}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            onSyncBatch={handleSyncBatch}
            isSyncing={isSyncing}
            chalkMode={chalkMode}
          />
        )}
      </main>
    </div>
  );
};
