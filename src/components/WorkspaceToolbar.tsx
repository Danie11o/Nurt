import React from 'react';
import { AlertTriangle, ChevronRight, GitCompare, Layers3, Plane, X } from 'lucide-react';
import { DroneMission, TimeStep } from '../types';

export type WorkspacePanel = 'MISSION' | 'PRIORITIES' | 'CHANGES' | null;

interface WorkspaceToolbarProps {
  activePanel: WorkspacePanel;
  onTogglePanel: (panel: Exclude<WorkspacePanel, null>) => void;
  mission: DroneMission;
  activeTimeStep: TimeStep;
  criticalCount: number;
  isInspectorOpen?: boolean;
}

const items = [
  { id: 'MISSION' as const, label: 'Misja i zasoby', short: 'Misja', icon: Plane, tone: 'cyan' },
  { id: 'PRIORITIES' as const, label: 'Priorytety', short: 'Alerty', icon: AlertTriangle, tone: 'rose' },
  { id: 'CHANGES' as const, label: 'Zmiany od lotu', short: 'Zmiany', icon: GitCompare, tone: 'amber' },
];

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  activePanel,
  onTogglePanel,
  mission,
  activeTimeStep,
  criticalCount,
  isInspectorOpen = false,
}) => (
  <div className="absolute top-3 left-3 right-3 z-[900] flex items-start justify-between gap-3 pointer-events-none">
    <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-xl">
      <div className="hidden sm:flex items-center gap-2 px-2.5 pr-3 border-r border-slate-700/80">
        <Layers3 className="w-4 h-4 text-blue-400" />
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Widok operacyjny</div>
          <div className="text-xs font-semibold text-slate-100">Mapa + warstwy na żądanie</div>
        </div>
      </div>

      {items.map(({ id, label, short, icon: Icon, tone }) => {
        const active = activePanel === id;
        const toneClass = tone === 'rose'
          ? 'text-rose-300 border-rose-500/50 bg-rose-500/15'
          : tone === 'amber'
            ? 'text-amber-300 border-amber-500/50 bg-amber-500/15'
            : 'text-cyan-300 border-cyan-500/50 bg-cyan-500/15';

        return (
          <button
            key={id}
            type="button"
            onClick={() => onTogglePanel(id)}
            aria-pressed={active}
            aria-label={active ? `Zamknij: ${label}` : `Otwórz: ${label}`}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition cursor-pointer ${
              active ? toneClass : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white'
            }`}
            title={active ? `Zamknij: ${label}` : `Otwórz: ${label}`}
          >
            {active ? <X className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{label}</span>
            <span className="md:hidden">{short}</span>
            {id === 'PRIORITIES' && criticalCount > 0 && (
              <span className="min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-mono font-black text-white">
                {criticalCount}
              </span>
            )}
          </button>
        );
      })}
    </div>

    {!isInspectorOpen && <div className="pointer-events-auto hidden lg:flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/88 px-3 py-2 shadow-xl backdrop-blur-xl">
      <div>
        <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Teraz</div>
        <div className="text-xs font-mono font-bold text-amber-300">{activeTimeStep}</div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
      <div>
        <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">UAV-01</div>
        <div className="text-xs font-semibold text-emerald-300">{mission.status} · {mission.battery}%</div>
      </div>
    </div>}
  </div>
);
