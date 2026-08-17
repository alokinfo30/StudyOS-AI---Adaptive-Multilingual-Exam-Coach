import React, { useState } from 'react';
import {
  Anchor,
  Cpu,
  Stethoscope,
  Compass,
  ArrowRight,
  Award,
  CheckCircle2,
  BookOpen,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import { CareerRoadmap, LanguageCode } from '../../types';
import { CAREER_ROADMAPS } from '../../data/careers';
import { getLocalizedText } from '../../data/languages';

interface CareerRoadmapViewProps {
  language: LanguageCode;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ language }) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(CAREER_ROADMAPS[0].id);
  const activeRoadmap = CAREER_ROADMAPS.find((c) => c.id === selectedCareerId) || CAREER_ROADMAPS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Indian Education & Career Pathways
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
            Career Roadmap Engine / करियर मार्गदर्शन एवं लक्ष्य
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Verified step-by-step milestones, entrance exams (IMU-CET, JEE, NEET), academic criteria, and licensing requirements.
          </p>
        </div>

        {/* Career Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
          {CAREER_ROADMAPS.map((career) => {
            const isSelected = selectedCareerId === career.id;
            return (
              <button
                key={career.id}
                onClick={() => setSelectedCareerId(career.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  {career.icon === 'Anchor' && <Anchor className="w-5 h-5 text-teal-400" />}
                  {career.icon === 'Cpu' && <Cpu className="w-5 h-5 text-blue-400" />}
                  {career.icon === 'Stethoscope' && <Stethoscope className="w-5 h-5 text-rose-400" />}
                  <span className="text-xs font-mono font-bold uppercase text-zinc-400">{career.category}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">
                  {getLocalizedText(career.title, language)}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Career Overview Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <h2 className="text-xl font-bold text-zinc-100 font-sans">
            {getLocalizedText(activeRoadmap.title, language)}
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {getLocalizedText(activeRoadmap.shortDescription, language)}
          </p>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-xs font-mono font-bold text-zinc-400">Stream & Eligibility</span>
            <p className="text-xs font-semibold text-zinc-200">{activeRoadmap.recommendedStream}</p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-xs font-mono font-bold text-zinc-400">Average Compensation</span>
            <p className="text-xs font-semibold text-emerald-400 font-mono">
              {activeRoadmap.avgStartingSalaryIndia}
            </p>
          </div>
        </div>

        {/* Core Skills Required */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Key Competencies & Subject Mastery
          </span>
          <div className="flex flex-wrap gap-2">
            {activeRoadmap.skillsRequired.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Educational Milestones Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-100">
          Step-by-Step Milestone Timeline / चरणबद्ध योजना
        </h3>

        <div className="space-y-4">
          {activeRoadmap.milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md relative pl-8 before:absolute before:left-3.5 before:top-8 before:bottom-0 before:w-0.5 before:bg-zinc-800 last:before:hidden"
            >
              <div className="absolute left-2.5 top-6 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-zinc-900" />

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {milestone.stage} ({milestone.ageOrClass})
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{milestone.selectionRate}</span>
                </div>

                <h4 className="text-base font-bold text-zinc-100">
                  {getLocalizedText(milestone.title, language)}
                </h4>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {getLocalizedText(milestone.description, language)}
                </p>

                {/* Exams & Institutes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
                    <span className="font-bold text-zinc-400 block mb-1 font-mono">Entrance Exams:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
                      {milestone.exams.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
                    <span className="font-bold text-zinc-400 block mb-1 font-mono">Top Institutions / Boards:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
                      {milestone.topInstitutes.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
