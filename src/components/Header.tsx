import React, { useState } from 'react';
import { Shield, Activity, RefreshCw, FileText, ChevronDown, X } from 'lucide-react';
import { DroneMission, TimeStep, OperationalProfile } from '../types';

interface HeaderProps {
  drone: DroneMission;
  activeTimeStep: TimeStep;
  onReset: () => void;
  onOpenReport: () => void;
  onOpenAnalysis: () => void;
  criticalAlertsCount: number;
  isDemoActive?: boolean;
  onStartDemo?: () => void;
  profile?: OperationalProfile;
  onToggleProfile?: (p: OperationalProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  drone,
  activeTimeStep,
  onReset,
  onOpenReport,
  onOpenAnalysis,
  criticalAlertsCount,
  isDemoActive = false,
  onStartDemo,
  profile = 'CIVIL',
  onToggleProfile,
}) => {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="relative h-14 bg-[#0a0f18] border-b border-slate-800/80 px-4 flex items-center justify-between z-[1300] select-none shadow-md shrink-0">
      {/* Lewa część: Brand, Tytuł i Przełącznik Profilu */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center w-8 h-8 rounded border bg-blue-600/20 border-blue-500/40 text-blue-400">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-wider text-base text-white">NURT C2</span>
            <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border font-semibold bg-blue-500/10 border-blue-500/30 text-blue-300">
              SAFE DUAL-USE
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 tracking-tight">
            Dane z drona → decyzja człowieka → LOT-02
          </span>
        </div>

        <span className="hidden md:inline-flex px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300">
          DEMO: DANE SYNTETYCZNE
        </span>
      </div>

      {/* Jedyna stale widoczna informacja wymagająca uwagi. */}
      <div className="hidden md:flex items-center">
        <div className={`flex items-center gap-2 px-3 py-1 rounded border ${
          criticalAlertsCount > 0 
            ? 'bg-rose-950/40 border-rose-600/40 text-rose-300' 
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}>
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-xs font-mono font-bold">
            ALERTY KRYTYCZNE: {criticalAlertsCount}
          </span>
        </div>
      </div>

      {/* Prawa część: Czas operacyjny i Narzędzia */}
      <div className="relative flex items-center gap-2">
        <div className="text-right hidden sm:block pr-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Symulacja C2</div>
          <div className="text-xs font-mono font-bold text-amber-400">T+{activeTimeStep} CEST</div>
        </div>

        {/* Przycisk START DEMO dla Jury */}
        {!isDemoActive && onStartDemo && (
          <button
            onClick={onStartDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-400/60 text-xs font-mono font-bold tracking-wide shadow-md shadow-amber-950/40 transition cursor-pointer active:scale-95 animate-pulse"
            title="Uruchom sekwencję demonstracyjną dla Jury"
          >
            <span className="w-2 h-2 rounded-full bg-slate-950"></span>
            <span>START DEMO</span>
          </button>
        )}

        <button
          onClick={() => setToolsOpen(open => !open)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
          aria-expanded={toolsOpen}
        >
          {toolsOpen ? <X className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Narzędzia</span>
        </button>

        {toolsOpen && (
          <div className="absolute right-0 top-11 z-[1400] w-56 rounded-xl border border-slate-700 bg-[#080d17] p-1.5 shadow-2xl">
        <button
          onClick={() => { onOpenAnalysis(); setToolsOpen(false); }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-cyan-300 hover:bg-cyan-950/70 transition cursor-pointer"
          title="Zobacz 7-etapowy proces analizy danych z drona"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Analiza danych</span>
        </button>

        <button
          onClick={() => { onOpenReport(); setToolsOpen(false); }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          title="Generuj Raport Operacyjny SITREP"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Raport SITREP</span>
        </button>

        <button
          onClick={() => { onReset(); setToolsOpen(false); }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
          title="Zresetuj stan scenariusza demonstracyjnego"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset scenariusza</span>
        </button>
          </div>
        )}
      </div>
    </header>
  );
};
