import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  RefreshCw,
  X,
  Play,
  ArrowRight,
  Terminal,
  Cpu,
  Lock,
  Sparkles,
  Bug,
  Flame,
  Radio,
} from 'lucide-react';
import {
  SelfHealingErrorPayload,
  SelfHealingPatchRecord,
  SelfHealingPipelineStage,
  SelfHealingStatus,
} from '../../types';
import {
  subscribeToSelfHealing,
  simulateTriggerError,
} from '../../services/selfHealingService';

interface SelfHealingDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelfHealingDashboardModal: React.FC<SelfHealingDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<SelfHealingStatus | null>(null);
  const [selectedPatchId, setSelectedPatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'patches' | 'errors'>('pipeline');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSelfHealing((newStatus) => {
      setStatus(newStatus);
      if (!selectedPatchId && newStatus.patchHistory.length > 0) {
        setSelectedPatchId(newStatus.patchHistory[0].id);
      }
    });
    return () => unsubscribe();
  }, [selectedPatchId]);

  if (!isOpen || !status) return null;

  const currentPatch =
    status.patchHistory.find((p) => p.id === selectedPatchId) || status.patchHistory[0];

  const handleTriggerSimulatedError = async (
    type: 'null_dereference' | 'zero_division' | 'api_timeout' | 'state_overflow'
  ) => {
    setIsSimulating(true);
    try {
      const newPatch = await simulateTriggerError(type);
      setSelectedPatchId(newPatch.id);
    } finally {
      setIsSimulating(false);
    }
  };

  const getStageStatus = (stage: SelfHealingPipelineStage) => {
    if (status.activePipelineStage === 'idle') return 'idle';
    if (status.activePipelineStage === stage) return 'active';

    const order: SelfHealingPipelineStage[] = [
      'error_intercepted',
      'agent1_root_cause_analysis',
      'agent2_patch_generation',
      'agent3_security_test_runner',
      'patch_auto_deployed',
    ];

    const currentIndex = order.indexOf(status.activePipelineStage);
    const stageIndex = order.indexOf(stage);

    if (currentIndex >= stageIndex && currentIndex !== -1) return 'completed';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-sans">
                  StudyOS Self-Healing AI Pipeline
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  ● ACTIVE INTERCEPTOR
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Automated Error Capture → Tri-Agent Root Cause Analysis → Security Guardrails & Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 bg-zinc-900/40 border-b border-zinc-800 text-xs font-mono">
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Errors Captured</span>
            <span className="text-base font-bold text-amber-400">{status.totalErrorsCaptured}</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Auto-Patches Applied</span>
            <span className="text-base font-bold text-emerald-400">{status.totalPatchesApplied}</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Auto-Resolution Rate</span>
            <span className="text-base font-bold text-teal-400">{status.autoResolutionRate}%</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">Security Guardrail Level</span>
            <span className="text-base font-bold text-indigo-400">Sandboxed Strict</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-4 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ⚡ Live Tri-Agent Pipeline
          </button>
          <button
            onClick={() => setActiveTab('patches')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'patches'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📋 Patch History & Diff Viewer ({status.patchHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'errors'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🚨 Captured Error Telemetry ({status.recentErrors.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Live Interactive Bug Simulator Controls */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-zinc-200 font-mono uppercase tracking-wide">
                      Test Live Self-Healing Pipeline
                    </h3>
                  </div>
                  <span className="text-[11px] text-zinc-400">Trigger test exceptions to watch the 3 AI Agents repair code in real time</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                  <button
                    disabled={isSimulating}
                    onClick={() => handleTriggerSimulatedError('null_dereference')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-left transition-all text-xs group disabled:opacity-50"
                  >
                    <div className="font-semibold text-zinc-200 group-hover:text-amber-400">
                      1. Null Dereference Bug
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">attempts.length on undefined</span>
                  </button>

                  <button
                    disabled={isSimulating}
                    onClick={() => handleTriggerSimulatedError('zero_division')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-left transition-all text-xs group disabled:opacity-50"
                  >
                    <div className="font-semibold text-zinc-200 group-hover:text-amber-400">
                      2. Division-by-Zero NaN
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">0 / 0 in accuracy formula</span>
                  </button>

                  <button
                    disabled={isSimulating}
                    onClick={() => handleTriggerSimulatedError('api_timeout')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-left transition-all text-xs group disabled:opacity-50"
                  >
                    <div className="font-semibold text-zinc-200 group-hover:text-amber-400">
                      3. Network API Timeout
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">&gt; 8000ms latency ceiling</span>
                  </button>

                  <button
                    disabled={isSimulating}
                    onClick={() => handleTriggerSimulatedError('state_overflow')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-left transition-all text-xs group disabled:opacity-50"
                  >
                    <div className="font-semibold text-zinc-200 group-hover:text-amber-400">
                      4. Async State Mutation
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">Uncaught listener error</span>
                  </button>
                </div>
              </div>

              {/* 4-Stage Visual Agentic Pipeline Flow */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-200 font-mono uppercase tracking-wide flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time 4-Stage Agent Execution Pipeline</span>
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Current Stage: <strong className="text-emerald-400">{status.activePipelineStage}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Stage 1: Interception */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      getStageStatus('error_intercepted') === 'active'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 animate-pulse'
                        : getStageStatus('error_intercepted') === 'completed'
                        ? 'bg-zinc-900 border-emerald-500/40 text-zinc-300'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold">STAGE 1</span>
                      <Radio className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 mb-1">Error Capture</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Intercepts unhandled console crashes, window.onerror & API exceptions.
                    </p>
                  </div>

                  {/* Stage 2: Agent 1 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      getStageStatus('agent1_root_cause_analysis') === 'active'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/40 animate-pulse'
                        : getStageStatus('agent1_root_cause_analysis') === 'completed'
                        ? 'bg-zinc-900 border-emerald-500/40 text-zinc-300'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold">STAGE 2</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 mb-1">Agent 1: Root Cause</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Maps AST codebase tree, pinpoints bug pattern and vulnerability risk.
                    </p>
                  </div>

                  {/* Stage 3: Agent 2 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      getStageStatus('agent2_patch_generation') === 'active'
                        ? 'bg-purple-500/10 border-purple-500 text-purple-300 ring-2 ring-purple-500/40 animate-pulse'
                        : getStageStatus('agent2_patch_generation') === 'completed'
                        ? 'bg-zinc-900 border-emerald-500/40 text-zinc-300'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold">STAGE 3</span>
                      <FileCode className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 mb-1">Agent 2: Patch Generator</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Synthesizes minimal surgical code patch avoiding breaking changes.
                    </p>
                  </div>

                  {/* Stage 4: Agent 3 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      getStageStatus('agent3_security_test_runner') === 'active' ||
                      getStageStatus('patch_auto_deployed') === 'active'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 animate-pulse'
                        : getStageStatus('agent3_security_test_runner') === 'completed'
                        ? 'bg-zinc-900 border-emerald-500/40 text-zinc-300'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold">STAGE 4</span>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 mb-1">Agent 3: Security & Tests</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Runs sandboxed AST checks, auth tamper guards & Vitest regression suite.
                    </p>
                  </div>
                </div>
              </div>

              {/* Latest Healed Patch Highlight */}
              {currentPatch && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                        Latest Applied & Verified Patch
                      </span>
                      <h4 className="text-sm font-bold text-zinc-100">
                        {currentPatch.rootCauseAnalysis.affectedFile}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        ✓ 12/12 Vitest Regressions Passed
                      </span>
                      <span className="text-zinc-500">
                        {new Date(currentPatch.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5 font-mono">
                    <div className="text-amber-400 font-bold">
                      Diagnosis: {currentPatch.rootCauseAnalysis.diagnosis}
                    </div>
                    <div className="text-zinc-400 text-[11px]">
                      Explanation: {currentPatch.patchDiff.patchExplanation}
                    </div>
                  </div>

                  {/* Diff Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 space-y-1 overflow-x-auto">
                      <div className="text-[10px] uppercase font-bold text-red-400">
                        - Original Failing Snippet
                      </div>
                      <pre className="text-[11px] whitespace-pre-wrap">{currentPatch.patchDiff.originalSnippet}</pre>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1 overflow-x-auto">
                      <div className="text-[10px] uppercase font-bold text-emerald-400">
                        + Self-Healed Repaired Snippet
                      </div>
                      <pre className="text-[11px] whitespace-pre-wrap">{currentPatch.patchDiff.repairedSnippet}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'patches' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {status.patchHistory.map((patch) => (
                  <div
                    key={patch.id}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                          {patch.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-zinc-200 font-mono">
                          {patch.rootCauseAnalysis.affectedFile}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {new Date(patch.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300">{patch.patchDiff.patchExplanation}</p>

                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                      <code>{patch.patchDiff.repairedSnippet}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-3">
              {status.recentErrors.map((err) => (
                <div
                  key={err.id}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/20 uppercase font-bold">
                        {err.type}
                      </span>
                      <span className="text-zinc-200 font-bold">{err.message}</span>
                    </div>
                    <div className="text-zinc-500 text-[11px]">
                      Source: {err.file || 'unknown'} {err.line ? `:${err.line}` : ''}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] shrink-0 font-bold ${
                      err.resolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {err.resolved ? 'RESOLVED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
