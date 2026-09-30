import React from 'react';
import { Play, CheckCircle2, Clock, Waves } from 'lucide-react';
import { TimeStep } from '../types';
import { TIMESTEP_DATA } from '../data/mockData';

interface TimelineBarProps {
  activeTimeStep: TimeStep;
  onChangeTimeStep: (timeStep: TimeStep) => void;
  isDemoActive?: boolean;
  demoStepIndex?: number;
  onStartDemo: () => void;
}

const STEPS: TimeStep[] = ['12:00', '12:15', '12:30', '12:45'];

export const TimelineBar: React.FC<TimelineBarProps> = ({
  activeTimeStep,
  onChangeTimeStep,
  isDemoActive = false,
  demoStepIndex = 0,
  onStartDemo,
}) => {
  const currentData = TIMESTEP_DATA[activeTimeStep];

  return (
    <div className="bg-[#0b101b]/95 backdrop-blur border-t border-slate-800/90 px-4 py-2.5 flex items-center justify-between select-none shadow-xl z-20 shrink-0">
      {/* Lewa strona: Kontrola odtwarzania */}
      <div className="flex items-center gap-3">
        {isDemoActive ? (
          <button
            disabled
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 cursor-default"
            title="Scenariusz z przewodnikiem jest aktywny"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DEMO: KROK {demoStepIndex + 1}/8</span>
          </button>
        ) : (
          <button
            onClick={onStartDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold transition cursor-pointer bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40"
            title="Uruchom ten sam 8-krokowy scenariusz z opisem co i gdzie obserwować"
          >
            <Play className="w-3.5 h-3.5" />
            <span>DEMO Z PRZEWODNIKIEM</span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-slate-400">OSIĄ CZASU POWODZI:</span>
          <span className="font-mono font-bold text-amber-400 text-sm">
            {activeTimeStep} CEST
          </span>
        </div>
      </div>

      {/* Środkowa część: Oś punktów czasu */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl mx-4">
        {STEPS.map((step, idx) => {
          const isActive = activeTimeStep === step;
          const isPassed = STEPS.indexOf(activeTimeStep) >= idx;

          return (
            <React.Fragment key={step}>
              {idx > 0 && (
                <div 
                  className={`flex-1 h-1 rounded transition duration-300 ${
                    isPassed ? 'bg-cyan-500/70' : 'bg-slate-800'
                  }`}
                />
              )}
              <button
                onClick={() => onChangeTimeStep(step)}
                className={`relative px-3 py-1 rounded font-mono text-xs font-bold transition flex flex-col items-center cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-105'
                    : isPassed
                    ? 'bg-slate-800 text-cyan-300 hover:bg-slate-750'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{step}</span>
                {step === '12:30' && (
                  <span className={`text-[8px] font-sans uppercase font-bold tracking-tight absolute -top-3 ${
                    isActive ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    Kulminacja
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Prawa strona: Wskaźnik dynamiki fali powodziowej */}
      <div className="hidden md:flex items-center gap-2.5 text-xs bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
        <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-mono text-slate-400 uppercase">
            Dynamika Przepływu Wisłoka
          </span>
          <span className="font-mono font-bold text-cyan-300 text-[11px]">
            {currentData.waterLevelDelta}
          </span>
        </div>
      </div>
    </div>
  );
};
