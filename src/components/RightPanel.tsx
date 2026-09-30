import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Send,
  UserCheck,
  Bot,
  XCircle,
  FileSearch,
  SlidersHorizontal
} from 'lucide-react';
import { AlertIncident, PriorityLevel } from '../types';

interface RightPanelProps {
  alerts: AlertIncident[];
  selectedAlertId: string | null;
  onSelectAlert: (alert: AlertIncident) => void;
  onDispatchAction: (alertId: string) => void;
  onRejectAction?: (alertId: string) => void;
  onShowOnMap?: (alert: AlertIncident) => void;
  profile?: import('../types').OperationalProfile;
  resources?: import('../types').OperationalResource[];
}

function getTargetResourceType(alert: AlertIncident): 'AMPHIBIOUS' | 'BOAT' | 'TEAM' {
  if (alert.category === 'BUILDING' || alert.title.toLowerCase().includes('odcięci') || alert.title.toLowerCase().includes('ludzi')) {
    return 'AMPHIBIOUS';
  }
  if (alert.category === 'FLOOD_SURGE' || alert.title.toLowerCase().includes('zalani')) {
    return 'BOAT';
  }
  return 'TEAM';
}

export const RightPanel: React.FC<RightPanelProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onDispatchAction,
  onRejectAction,
  onShowOnMap,
  profile = 'CIVIL',
  resources = [],
}) => {
  const [filter, setFilter] = useState<'ALL' | PriorityLevel>('ALL');
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  const filteredAlerts = [...alerts]
    .sort((a, b) => b.priorityScore - a.priorityScore) // Sortowanie wg priorityScore (0-100)
    .filter(a => {
      if (filter === 'ALL') return true;
      return a.severity === filter;
    });

  const getLevelBadge = (level: PriorityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Info className="w-3 h-3 text-amber-400" />
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Info className="w-3 h-3 text-blue-400" />
            LOW
          </span>
        );
    }
  };

  return (
    <aside className="w-96 bg-[#0d131f] border-l border-slate-800/80 flex flex-col h-full overflow-hidden select-none shrink-0 z-20">
      {/* Nagłówek panelu */}
      <div className="p-3.5 border-b border-slate-800/80 bg-[#0a0f18]/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
                Priorytety Operacyjne
              </h2>
              <div className="text-[10px] text-slate-400">
                Wycena algorytmiczna (0-100) • Decyzja dowódcy
              </div>
            </div>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-850 text-slate-200 border border-slate-700">
            {filteredAlerts.length}
          </span>
        </div>

        {/* Przyciski filtrów */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-1 rounded transition cursor-pointer ${
              filter === 'ALL' 
                ? 'bg-slate-700 text-white font-bold' 
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Wszystkie ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-2 py-1 rounded transition cursor-pointer ${
              filter === 'CRITICAL' 
                ? 'bg-rose-900/60 text-rose-200 font-bold border border-rose-600/50' 
                : 'bg-slate-900/80 text-rose-400/80 hover:text-rose-300'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-2 py-1 rounded transition cursor-pointer ${
              filter === 'HIGH' 
                ? 'bg-orange-900/60 text-orange-200 font-bold border border-orange-600/50' 
                : 'bg-slate-900/80 text-orange-400/80 hover:text-orange-300'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('MEDIUM')}
            className={`px-2 py-1 rounded transition cursor-pointer ${
              filter === 'MEDIUM' 
                ? 'bg-amber-900/60 text-amber-200 font-bold border border-amber-600/50' 
                : 'bg-slate-900/80 text-amber-400/80 hover:text-amber-300'
            }`}
          >
            Medium
          </button>
        </div>
      </div>

      {/* Lista alertów operacyjnych */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
            <div className="text-xs font-mono font-bold text-slate-300">BRAK ZAGROŻEŃ W TEJ KATEGORII</div>
            <div className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
              Dla wybranego filtra nie wykryto aktywnych incydentów w tym kroku czasowym.
            </div>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isSelected = selectedAlertId === alert.id;
            const isDispatched = alert.status === 'DISPATCHED' || alert.operatorDecision === 'APPROVED';
            const isRejected = alert.status === 'REJECTED' || alert.operatorDecision === 'REJECTED';
            const isEvidenceOpen = expandedEvidenceId === alert.id;

            return (
              <div
                key={alert.id}
                className={`rounded-lg border transition duration-150 p-3 flex flex-col gap-2 relative ${
                  isSelected
                    ? 'bg-slate-850/95 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                    : isRejected
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : alert.severity === 'CRITICAL'
                    ? 'bg-[#150f16]/80 border-rose-900/60 hover:border-rose-700/80'
                    : 'bg-[#101622]/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-lg"></div>
                )}

                {/* Linia 1: Severity + priorityScore + Czas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getLevelBadge(alert.severity)}
                    {/* Wskaźnik punktowy priorityScore: 0-100 */}
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono">
                      <span className="text-slate-400">SCORE:</span>
                      <span className={`font-bold ${
                        alert.priorityScore >= 85 ? 'text-rose-400' : alert.priorityScore >= 70 ? 'text-orange-400' : 'text-amber-300'
                      }`}>
                        {alert.priorityScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {alert.timestamp || alert.detectedAt}
                  </div>
                </div>

                {/* Tytuł alertu */}
                <h3 className="text-xs font-bold text-slate-100 tracking-tight leading-snug">
                  {alert.title}
                </h3>

                {/* Lokalizacja */}
                <div className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-300">
                    {alert.location || alert.locationName}
                  </span>
                </div>

                {/* Uzasadnienie (Reason) */}
                <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-0.5">
                    Przyczyna alertu (Reason):
                  </span>
                  {alert.reason}
                </div>

                {/* Materiał dowodowy (Evidence) - zwijany */}
                <div className="text-[10px] font-mono">
                  <button
                    onClick={() => setExpandedEvidenceId(isEvidenceOpen ? null : alert.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                  >
                    <FileSearch className="w-3 h-3 text-cyan-400" />
                    <span>{isEvidenceOpen ? 'Zwiń materiał dowodowy' : 'Pokaż źródła / dowody (Evidence)'}</span>
                  </button>

                  {isEvidenceOpen && (
                    <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 leading-normal animate-in fade-in duration-100">
                      {alert.evidence}
                    </div>
                  )}
                </div>

                {/* SEKCYJNY PODZIAŁ: AI RECOMMENDATION vs FINAL HUMAN DECISION */}
                <div className="pt-1 space-y-1.5">
                  {/* Blok 1: Rekomendacja Algorytmiczna */}
                  <div className="p-2 rounded bg-cyan-950/20 border border-cyan-500/30 text-[11px]">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      <span className="flex items-center gap-1">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        Reguły priorytetyzacji
                      </span>
                      <span className="text-slate-400 font-normal">
                        {alert.uncertaintyMargin}
                      </span>
                    </div>
                    <div className="text-slate-200 font-medium">
                      {alert.recommendedAction}
                    </div>
                  </div>

                  {/* Blok 2: Ostateczna decyzja człowieka (Human in the Loop) */}
                  <div className={`p-2 rounded border text-[11px] transition ${
                    isDispatched
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : isRejected
                      ? 'bg-slate-900 border-slate-700 text-slate-400'
                      : 'bg-amber-950/20 border-amber-600/30 text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider mb-1">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Ostateczna Decyzja: Operator Ludzki
                      </span>
                      <span className={isDispatched ? 'text-emerald-400 font-bold' : isRejected ? 'text-slate-400' : 'text-amber-400'}>
                        {isDispatched ? 'ZATWIERDZONO' : isRejected ? 'ODRZUCONO' : 'OCZEKUJE NA DECYZJĘ'}
                      </span>
                    </div>

                    {/* Panel akcji decyzyjnej */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {(() => {
                        const reqType = getTargetResourceType(alert);
                        const resourceObj = resources?.find(r => r.type === reqType);
                        const hasAvailable = resourceObj ? resourceObj.available > 0 : true;

                        if (isDispatched) {
                          return (
                            <button
                              disabled
                              className="flex-1 py-1.5 px-2.5 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 cursor-not-allowed opacity-90"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Zadysponowano ({alert.assignedTeam ? alert.assignedTeam.split('(')[0].trim() : 'SOP'})</span>
                            </button>
                          );
                        }

                        if (!hasAvailable) {
                          return (
                            <button
                              disabled
                              className="flex-1 py-1.5 px-2.5 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 bg-slate-900 border border-rose-600/50 text-rose-400 cursor-not-allowed opacity-80"
                              title={`Brak wolnych zasobów w sztabie dla: ${resourceObj?.name || 'SOP'}`}
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Brak sił ({resourceObj?.badge || 'SOP'})</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={() => onDispatchAction(alert.id)}
                            className="flex-1 py-1.5 px-2.5 rounded text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95"
                            title={`Zadysponuj dostępny zasób: ${resourceObj?.name || 'Zespół'}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Zatwierdź rozkaz</span>
                          </button>
                        );
                      })()}

                      {onRejectAction && !isDispatched && (
                        <button
                          onClick={() => onRejectAction(alert.id)}
                          className="py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
                          title="Odrzuć rekomendację"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Przyciski nawigacyjne do mapy i szczegółów alertu */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onShowOnMap) {
                        onShowOnMap(alert);
                      } else {
                        onSelectAlert(alert);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded bg-slate-800 hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-600/50 text-xs font-mono transition cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pokaż na mapie</span>
                  </button>

                  <button
                    onClick={() => onSelectAlert(alert)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-mono font-bold transition cursor-pointer"
                    title="Otwórz pełny widok operacyjny alertu z kadrów drona"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Szczegóły</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stopka z informacją Human-in-the-loop */}
      <div className="p-2.5 bg-[#0a0f18] border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>ZASADA: CZŁOWIEK W PĘTLI</span>
        <span className="text-cyan-400 font-bold">HITL (HUMAN-IN-THE-LOOP)</span>
      </div>
    </aside>
  );
};
