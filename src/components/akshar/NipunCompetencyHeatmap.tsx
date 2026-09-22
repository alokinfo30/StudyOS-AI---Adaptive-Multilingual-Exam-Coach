import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { 
  NIPUN_INDICATORS, 
  SAMPLE_STUDENT_COMPETENCIES 
} from '../../data/aksharData';
import { 
  NipunIndicatorId, 
  CompetencyLevel, 
  StudentCompetencyRecord, 
  GradeLevel, 
  Dialect 
} from '../../types/akshar';
import { KinestheticRemediationModal } from './KinestheticRemediationModal';

interface NipunCompetencyHeatmapProps {
  onOpenKinestheticDrill?: (studentName: string, drillType: 'letter_split' | 'latin_mirror' | 'bead_frame') => void;
}

export const NipunCompetencyHeatmap: React.FC<NipunCompetencyHeatmapProps> = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedDialect, setSelectedDialect] = useState<Dialect | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Drill Modal State
  const [activeDrillModal, setActiveDrillModal] = useState<{
    isOpen: boolean;
    studentName: string;
    drillType: 'letter_split' | 'latin_mirror' | 'bead_frame';
  }>({
    isOpen: false,
    studentName: '',
    drillType: 'letter_split',
  });

  // Selected Student for Deep-Dive Drawer
  const [selectedStudent, setSelectedStudent] = useState<StudentCompetencyRecord | null>(
    SAMPLE_STUDENT_COMPETENCIES[0]
  );

  // Filtered Students
  const filteredStudents = SAMPLE_STUDENT_COMPETENCIES.filter((st) => {
    if (selectedGrade !== 'all' && st.grade !== selectedGrade) return false;
    if (selectedDialect !== 'all' && st.dialect !== selectedDialect) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        st.studentName.toLowerCase().includes(q) ||
        st.rollNumber.toString().includes(q) ||
        st.dialect.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Metrics
  const totalCells = filteredStudents.length * NIPUN_INDICATORS.length;
  let proficientCount = 0;
  let developingCount = 0;
  let interventionCount = 0;

  filteredStudents.forEach((st) => {
    Object.values(st.competencies).forEach((lvl) => {
      if (lvl === 'proficient') proficientCount++;
      else if (lvl === 'developing') developingCount++;
      else if (lvl === 'intervention') interventionCount++;
    });
  });

  const proficiencyRate = totalCells > 0 ? Math.round((proficientCount / totalCells) * 100) : 0;

  const getCellColor = (lvl: CompetencyLevel) => {
    switch (lvl) {
      case 'proficient':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'developing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'intervention':
        return 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getCellLabel = (lvl: CompetencyLevel) => {
    switch (lvl) {
      case 'proficient':
        return 'दक्ष (P)';
      case 'developing':
        return 'प्रगति (D)';
      case 'intervention':
        return 'लक्ष्य (I)';
      default:
        return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                NIPUN Bharat FLN Benchmark
              </span>
              <span className="text-xs text-zinc-400">कक्षा १–३ वास्तविक समय हीटमैप</span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
              निपुण भारत दक्षता व अधिगम दृष्टि मैट्रिक्स
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
              प्रत्येक छात्र की मातृभाषा बोली पृष्ठभूमि के साथ वर्ण पहचान, मात्रा पठन और हासिल जोड़ में संज्ञानात्मक त्रुटियों की तत्काल दृश्यता।
            </p>
          </div>

          {/* Aggregate KPI Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 min-w-[110px] text-center">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase">कक्षा FLN दक्षता</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {proficiencyRate}%
              </div>
              <div className="text-[10px] text-zinc-500">लक्ष्य: 85%+</div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 min-w-[110px] text-center">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase">हस्तक्षेप आवश्यक</div>
              <div className="text-2xl font-black text-red-400 font-mono mt-0.5">
                {interventionCount}
              </div>
              <div className="text-[10px] text-zinc-500">दल १ में प्राथमिकता</div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 min-w-[110px] text-center">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase">विकासशील</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                {developingCount}
              </div>
              <div className="text-[10px] text-zinc-500">सहपाठी अभ्यास दल २</div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-zinc-800/80 pt-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="छात्र नाम या रोल नंबर खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {/* Grade Filter */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-500 px-2 text-[11px]">कक्षा:</span>
              {(['all', 1, 2, 3] as const).map((g) => (
                <button
                  key={`grade-${g}`}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2 py-0.5 rounded-lg font-medium transition ${
                    selectedGrade === g
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {g === 'all' ? 'सभी' : `कक्षा ${g}`}
                </button>
              ))}
            </div>

            {/* Dialect Filter */}
            <select
              value={selectedDialect}
              onChange={(e) => setSelectedDialect(e.target.value as Dialect | 'all')}
              className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">सभी बोलियाँ (All Dialects)</option>
              <option value="bhojpuri">भोजपुरी (Bhojpuri)</option>
              <option value="awadhi">अवधी (Awadhi)</option>
              <option value="maithili">मैथिली (Maithili)</option>
              <option value="magahi">मगही (Magahi)</option>
              <option value="bundelkhandi">बुंदेलखंडी (Bundelkhandi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Heatmap Grid & Deep-Dive Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Matrix Table (2 cols on large screen) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                निपुण FLN संकेतक ग्रिड (NIPUN Indicators Heatmap)
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              {filteredStudents.length} छात्र प्रदर्शित
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 text-[11px]">
                  <th className="py-2.5 px-3 font-semibold sticky left-0 bg-zinc-950 z-10 w-44">
                    छात्र व बोली (Student & Dialect)
                  </th>
                  <th className="py-2.5 px-2 font-semibold text-center w-14">दल (Band)</th>
                  {NIPUN_INDICATORS.map((ind) => (
                    <th
                      key={ind.id}
                      className="py-2.5 px-2 font-semibold text-center min-w-[75px]"
                      title={`${ind.code}: ${ind.titleEnglish}\n${ind.benchmarkDescription}`}
                    >
                      <div className="font-mono font-bold text-zinc-200">{ind.code}</div>
                      <div className="text-[9px] text-zinc-500 truncate max-w-[70px]">
                        {ind.domain === 'literacy' ? 'भाषा' : 'गणित'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {filteredStudents.map((st) => {
                  const isSelected = selectedStudent?.studentId === st.studentId;
                  return (
                    <tr
                      key={st.studentId}
                      onClick={() => setSelectedStudent(st)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 hover:bg-amber-500/15 ring-1 ring-amber-500/30'
                          : 'hover:bg-zinc-800/50'
                      }`}
                    >
                      {/* Student Info */}
                      <td className="py-2.5 px-3 sticky left-0 bg-zinc-900/90 z-10">
                        <div className="font-sans font-bold text-zinc-200 text-xs">
                          {st.studentName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-sans">
                          <span>रोल #{st.rollNumber}</span>
                          <span>•</span>
                          <span className="text-amber-400 uppercase font-semibold">{st.dialect}</span>
                        </div>
                      </td>

                      {/* Band Tag */}
                      <td className="py-2.5 px-2 text-center font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            st.currentBand === 1
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : st.currentBand === 2
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          दल {st.currentBand}
                        </span>
                      </td>

                      {/* Indicator Heatmap Cells */}
                      {NIPUN_INDICATORS.map((ind) => {
                        const level = st.competencies[ind.id] || 'intervention';
                        return (
                          <td key={ind.id} className="py-2 px-1 text-center">
                            <span
                              className={`inline-block px-1.5 py-1 rounded-md text-[10px] font-semibold border transition-all ${getCellColor(
                                level
                              )}`}
                            >
                              {getCellLabel(level)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-950/80 border-t border-zinc-800 text-[11px] text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="font-bold text-zinc-300">संकेत सूची:</span>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span>दक्ष (Proficient - 80%+)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                <span>प्रगति (Developing - 50-80%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
                <span>हस्तक्षेप (Intervention - &lt;50%)</span>
              </div>
            </div>
            <span>किसी भी छात्र पर क्लिक कर विस्तृत निदान देखें</span>
          </div>
        </div>

        {/* Right Column: Selected Student Diagnostic Detail & Quick Kinesthetic Remediation */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">छात्र संज्ञानात्मक विश्लेषण</h3>
            </div>
            {selectedStudent && (
              <span className="text-xs text-amber-400 font-semibold font-mono">
                रोल #{selectedStudent.rollNumber}
              </span>
            )}
          </div>

          {selectedStudent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-serif">
                    {selectedStudent.studentName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span>कक्षा {selectedStudent.grade}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-semibold">मातृभाषा: {selectedStudent.dialect}</span>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                    selectedStudent.currentBand === 1
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : selectedStudent.currentBand === 2
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  दल {selectedStudent.currentBand}
                </div>
              </div>

              {/* Primary Cognitive Misconception Identified */}
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>मुख्य संज्ञानात्मक भ्रम (Root Misconception):</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedStudent.primaryMisconception || 'कोई गंभीर भ्रम नहीं पाया गया।'}
                </p>
              </div>

              {/* 1-Minute Actionable Physical Remediation */}
              <div className="rounded-xl bg-zinc-950 border border-emerald-500/30 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>1-मिनट शून्य-लागत कक्षा उपचार:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedStudent.actionableTip || 'सहपाठी पाठ वाचन में साथी नेता बनाएं।'}
                </p>
              </div>

              {/* Launch Kinesthetic Micro-Drill Button */}
              <div className="pt-2">
                <button
                  onClick={() =>
                    setActiveDrillModal({
                      isOpen: true,
                      studentName: selectedStudent.studentName,
                      drillType:
                        selectedStudent.primaryMisconception?.includes("'व'")
                          ? 'letter_split'
                          : selectedStudent.primaryMisconception?.includes('regrouping')
                          ? 'bead_frame'
                          : 'latin_mirror',
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 px-4 py-2.5 text-xs font-bold text-zinc-950 transition shadow-lg shadow-orange-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>शारीरिक व दृश्य निवारण ड्रिल शुरू करें (Start Micro-Drill)</span>
                </button>
              </div>

              {/* Indicator Detail Breakdown */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  संकेतक अनुसार स्थिति (Breakdown):
                </span>
                <div className="space-y-1.5 text-xs">
                  {NIPUN_INDICATORS.map((ind) => {
                    const status = selectedStudent.competencies[ind.id];
                    return (
                      <div
                        key={ind.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80"
                      >
                        <div className="truncate max-w-[180px]">
                          <span className="font-mono font-bold text-amber-400 mr-1.5">
                            {ind.code}
                          </span>
                          <span className="text-zinc-300 text-[11px]">{ind.titleHindi}</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCellColor(
                            status
                          )}`}
                        >
                          {getCellLabel(status)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500">
              विस्तार से देखने के लिए बाईं तालिका से किसी छात्र को चुनें।
            </div>
          )}
        </div>
      </div>

      {/* Kinesthetic Micro-Drill Modal */}
      <KinestheticRemediationModal
        isOpen={activeDrillModal.isOpen}
        onClose={() => setActiveDrillModal((prev) => ({ ...prev, isOpen: false }))}
        drillType={activeDrillModal.drillType}
        studentName={activeDrillModal.studentName}
      />
    </div>
  );
};
