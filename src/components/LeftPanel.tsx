import React from 'react';
import { 
  Plane, 
  BatteryCharging, 
  Database, 
  CheckCircle2, 
  UploadCloud, 
  Cpu, 
  Image as ImageIcon, 
  Navigation,
  Check,
  Radio,
  FileCheck2,
  Workflow,
  Shield
} from 'lucide-react';
import { DroneMission, PublicDataSource, TimeStep, MissionStage, OperationalResource, RetaskTarget } from '../types';

interface LeftPanelProps {
  mission: DroneMission;
  publicSources: PublicDataSource[];
  activeTimeStep: TimeStep;
  onLocateDrone: () => void;
  resources: OperationalResource[];
  retaskTarget?: RetaskTarget | null;
}

const STAGES: { key: MissionStage; label: string; icon: React.ReactNode }[] = [
  { key: 'REQUESTED', label: 'Zgłoszenie zapotrzebowania', icon: <Radio className="w-3.5 h-3.5" /> },
  { key: 'DISPATCHED', label: 'Start i dolot drona', icon: <Plane className="w-3.5 h-3.5" /> },
  { key: 'CAPTURED', label: 'Pozyskiwanie zobrazowań', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { key: 'UPLOAD', label: 'Transmisja danych (Mesh)', icon: <UploadCloud className="w-3.5 h-3.5" /> },
  { key: 'ANALYSIS', label: 'Porządkowanie obserwacji', icon: <Cpu className="w-3.5 h-3.5" /> },
  { key: 'INTELLIGENCE_READY', label: 'Gotowość danych sztabowych', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
];

export const LeftPanel: React.FC<LeftPanelProps> = ({
  mission,
  publicSources,
  activeTimeStep,
  onLocateDrone,
  resources,
  retaskTarget,
}) => {
  const currentStageIndex = STAGES.findIndex(s => s.key === mission.currentStage);

  return (
    <aside className="w-80 bg-[#0d131f] border-r border-slate-800/80 flex flex-col h-full select-none shrink-0 z-20 overflow-hidden">
      {/* Główny, w pełni przewijany kontener całego panelu lewego (rozwiązuje problem ucinania dołu) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-slate-800/80">
        
        {/* 1. SEKCJA GŁÓWNA: DRONE MISSION COMMAND CARD */}
        <div className="p-3 bg-[#090e17]/90 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shrink-0">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    MISJA DRONOWA
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                    {mission.id}
                  </span>
                </div>
                <h2 className="text-xs font-bold text-white tracking-tight">
                  {mission.callsign} • {mission.model}
                </h2>
              </div>
            </div>

            <button
              onClick={onLocateDrone}
              className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-600/50 text-[11px] font-mono font-bold text-cyan-300 transition cursor-pointer shrink-0"
              title="Wyśrodkuj widok mapy na dronie"
            >
              <Navigation className="w-3 h-3 text-cyan-400" />
              <span>Namierz</span>
            </button>
          </div>

          {/* Panel Telemetryczny i Wskaźniki Misji */}
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
            {/* Status drona + bateria */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${retaskTarget ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className={`font-mono font-bold text-[11px] ${retaskTarget ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {retaskTarget ? 'RE-TASKED / ZADANIOWANO' : mission.status}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-slate-200 text-[11px]">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>{mission.battery}%</span>
              </div>
            </div>

            {retaskTarget && (
              <div className="p-1 rounded bg-amber-950/70 border border-amber-500/50 text-[9px] font-mono text-amber-300 flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">🎯 CEL RE-TASK:</span>
                <span className="text-amber-200 truncate max-w-[150px]">{retaskTarget.title}</span>
              </div>
            )}

            {/* Postęp misji i pokrycie terenu */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Postęp misji lotniczej:</span>
                <span className="font-bold text-cyan-300">{mission.missionProgressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{ width: `${mission.missionProgressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Siatka wskaźników operacyjnych */}
            <div className="grid grid-cols-3 gap-1 pt-0.5 text-center font-mono">
              <div className="p-1 rounded bg-slate-950/70 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Pułap AGL</div>
                <div className="text-xs font-bold text-slate-100">{mission.altitude}m</div>
              </div>
              <div className="p-1 rounded bg-slate-950/70 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Pokrycie</div>
                <div className="text-xs font-bold text-cyan-300">{mission.coveragePercent}%</div>
              </div>
              <div className="p-1 rounded bg-slate-950/70 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Klatki 4K</div>
                <div className="text-xs font-bold text-amber-300">{mission.capturedFramesCount}</div>
              </div>
            </div>

            {/* Ostatni upload danych */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <UploadCloud className="w-3 h-3 text-cyan-400" />
                Ostatni upload:
              </span>
              <span className="text-slate-100 font-semibold">{mission.lastDataUpload}</span>
            </div>
          </div>
        </div>

        {/* 2. KLUCZOWY WORKFLOW MISJI DRONOWEJ (6-STEP VISUAL PIPELINE) */}
        <div className="p-3 bg-[#0a0f18]/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cykl Operacyjny Misji</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
              ETAP {currentStageIndex + 1}/6
            </span>
          </div>

          {/* Wizualny stepper przepływu danych */}
          <div className="space-y-1 font-mono text-[10px]">
            {STAGES.map((st, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div 
                  key={st.key}
                  className={`flex items-center justify-between p-1 px-1.5 rounded transition ${
                    isCurrent 
                      ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-bold'
                      : isCompleted
                      ? 'bg-slate-900/40 text-slate-300'
                      : 'text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-cyan-400 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span>{st.label}</span>
                  </div>

                  {isCurrent && (
                    <span className="text-[8px] tracking-wider uppercase px-1 py-0.2 rounded bg-cyan-400 text-slate-950 font-bold">
                      AKTYWNY
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.5 SEKCJA: SIŁY I ŚRODKI (SOP / DYSPOZYCJA W SZTABIE) */}
        <div className="p-3 bg-[#090e17]/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Siły i Środki (SOP)
              </h3>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 font-bold">
              STAN SZTABU
            </span>
          </div>

          <div className="space-y-1.5">
            {resources.map((res) => {
              const hasAvailable = res.available > 0;
              return (
                <div 
                  key={res.id} 
                  className="p-1.5 px-2 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${hasAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      <span>{res.name}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {res.badge} • <span className="text-amber-400 font-bold">{res.inAction} w działaniu</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-xs ${hasAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {res.available} / {res.total}
                    </span>
                    <div className="text-[8px] text-slate-400 uppercase">dostępne</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. ŹRÓDŁA DANYCH PRZESTRZENNYCH (STATUS REFERENCYJNY) */}
        <div className="p-3 bg-[#0a0f18]/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Źródła Danych (Referencyjne)
              </h3>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900/30 text-blue-300 border border-blue-800">
              4 ŹRÓDŁA DEMO
            </span>
          </div>

          <div className="space-y-1.5 select-text">
            {publicSources.map((source) => (
              <div 
                key={source.id}
                className="p-2 rounded bg-slate-900/70 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-semibold text-slate-200">
                    {source.name}
                  </span>
                  <span className="text-[8px] font-mono font-bold px-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {source.badge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2">
                  {source.detail}
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-[9px] font-mono">
                  <span className="text-slate-400">{source.provider}</span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {source.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Stopka - przyklejona na stałe do dołu panelu lewego */}
      <div className="p-2 bg-[#090d15] border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between shrink-0">
        <span>KORYTARZ: ZAPLANOWANY</span>
        <span className="text-cyan-400 font-bold">PAKIET DEMO / TRYB OFFLINE</span>
      </div>
    </aside>
  );
};
