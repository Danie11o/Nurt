import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertOctagon, 
  Car, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  GitCompare, 
  Plane,
  Eye
} from 'lucide-react';
import { TimeStep, FlightDiffReport } from '../types';
import { FLIGHT_DIFF_REPORTS } from '../data/situationalData';

interface FlightDiffBannerProps {
  activeTimeStep: TimeStep;
}

export const FlightDiffBanner: React.FC<FlightDiffBannerProps> = ({ activeTimeStep }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const diff: FlightDiffReport = FLIGHT_DIFF_REPORTS[activeTimeStep];

  const isBaseFlight = !diff.previousStep;
  const isPositiveWater = diff.floodedAreaHectaresDiff > 0;
  const isNegativeWater = diff.floodedAreaHectaresDiff < 0;

  return (
    <div className="bg-[#0c1322]/95 backdrop-blur-md border-t border-b border-cyan-500/30 px-4 py-2 select-none shadow-lg z-20 shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Lewa strona: Etykieta sekcji i nazwa przelotu */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-cyan-500/10 border border-cyan-400/40 text-cyan-300">
            <GitCompare className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                CHANGES SINCE LAST FLIGHT
              </span>
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {diff.flightName}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isBaseFlight ? (
                <span>Punkt odniesienia dla kolejnych nalotów patrolowych drona</span>
              ) : (
                <span>Porównanie z przelotem o godz. <strong className="text-cyan-300 font-mono">{diff.previousStep}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Środek: 4 Kluczowe kafelki statystyczne (Diff metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {/* 1. Obszar zalany */}
          <div className="p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Obszar zalany</div>
              <div className={`font-bold flex items-center gap-1 ${
                isPositiveWater ? 'text-rose-400' : isNegativeWater ? 'text-emerald-400' : 'text-slate-300'
              }`}>
                {isPositiveWater && <TrendingUp className="w-3 h-3 text-rose-400" />}
                {isNegativeWater && <TrendingDown className="w-3 h-3 text-emerald-400" />}
                {isBaseFlight ? '48.5 ha' : `${isPositiveWater ? '+' : ''}${diff.floodedAreaPercentChange}% (${isPositiveWater ? '+' : ''}${diff.floodedAreaHectaresDiff} ha)`}
              </div>
            </div>
          </div>

          {/* 2. Nowe drogi nieprzejezdne */}
          <div className="p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Drogi zablokowane</div>
              <div className={`font-bold ${diff.newBlockedRoadsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {diff.newBlockedRoadsCount > 0 ? `+${diff.newBlockedRoadsCount} nowe nieprzejezdne` : '0 nowych blokad'}
              </div>
            </div>
            <Car className={`w-3.5 h-3.5 ${diff.newBlockedRoadsCount > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
          </div>

          {/* 3. Zagrożone budynki */}
          <div className="p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Zagrożone obiekty</div>
              <div className={`font-bold ${diff.newThreatenedBuildingsCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                {diff.newThreatenedBuildingsCount > 0 ? `+${diff.newThreatenedBuildingsCount} nowych budynków` : 'Stan stabilny'}
              </div>
            </div>
            <Home className={`w-3.5 h-3.5 ${diff.newThreatenedBuildingsCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>

          {/* 4. Nowe alerty i detekcje AI */}
          <div className="p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Nowe obserwacje</div>
              <div className={`font-bold ${diff.newCriticalAlertsCount > 0 ? 'text-rose-400' : diff.newDetectionsCount > 0 ? 'text-cyan-300' : 'text-slate-300'}`}>
                {diff.newCriticalAlertsCount > 0 ? `+${diff.newCriticalAlertsCount} CRITICAL` : diff.newDetectionsCount > 0 ? `+${diff.newDetectionsCount} obiekty` : 'Brak nowych'}
              </div>
            </div>
            <AlertOctagon className={`w-3.5 h-3.5 ${diff.newCriticalAlertsCount > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
          </div>
        </div>

        {/* Prawa strona: Przycisk rozwijania szczegółów */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition cursor-pointer border border-slate-700"
          >
            <span>{isExpanded ? 'Zwiń analizę' : 'Szczegóły zmian'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Rozwijany panel szczegółów różnicowych */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Główne punkty różnicowe od poprzedniego nalotu:</span>
            </div>
            <ul className="space-y-1 text-slate-300">
              {diff.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded bg-amber-950/20 border border-amber-600/30 space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡ Wniosek Operacyjny dla Sztabu Kryzysowego:</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {diff.tacticalSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
