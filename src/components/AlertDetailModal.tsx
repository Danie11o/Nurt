import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Radio, 
  Activity, 
  Check, 
  Users, 
  Navigation, 
  TrendingUp, 
  Database, 
  ShieldAlert, 
  ChevronRight,
  Crosshair,
  AlertOctagon,
  Sparkles,
  Bot,
  UserCheck
} from 'lucide-react';
import { AlertIncident, OperationalResource, OperationalProfile } from '../types';
import { TACTICAL_IMAGE_FALLBACK } from '../data/mockData';

interface AlertDetailModalProps {
  alert: AlertIncident | null;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onAssignTeam: (alertId: string, teamName: string) => void;
  onShowOnMap: (alert: AlertIncident) => void;
  onRetaskDrone?: (alert: AlertIncident) => void;
  isRetasked?: boolean;
  resources?: OperationalResource[];
  profile?: OperationalProfile;
}

const AVAILABLE_TEAMS = [
  { name: 'Partner operacyjny — pojazd terenowy', type: 'AMPHIBIOUS' },
  { name: 'PSP JRG-1 Rzeszów — Zespół Ratownictwa Wodnego (Łódź)', type: 'BOAT' },
  { name: 'OSP Krasne — Zastęp z pompami dużej wydajności', type: 'TEAM' },
  { name: 'KPP Policja — Posterunek blokadowy i ewakuacyjny', type: 'TEAM' },
];

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onAcknowledge,
  onAssignTeam,
  onShowOnMap,
  onRetaskDrone,
  isRetasked = false,
  resources = [],
  profile = 'CIVIL',
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>(AVAILABLE_TEAMS[0].name);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  if (!alert) return null;

  const isCritical = alert.severity === 'CRITICAL';
  const isHigh = alert.severity === 'HIGH';

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-[#0c121e] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pasek nagłówkowy C2 */}
        <div className="px-5 py-3.5 bg-[#090e18] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  Szczegółowa Karta Operacyjna Alertu
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ID: {alert.id}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isCritical 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                    : isHigh 
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {alert.severity} • PRIORITY SCORE: {alert.priorityScore}/100
                </span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight mt-0.5">
                {alert.title}
              </h1>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zawartość główna modalna w dwóch kolumnach */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Lewa kolumna: Kadr z drona + Dane telemetryczne (5 kolumn) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Podgląd z drona z HUD */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video lg:h-64 flex items-center justify-center shadow-lg">
              {alert.droneImage ? (
                <img 
                  src={alert.droneImage} 
                  alt={alert.title} 
                  className="w-full h-full object-cover filter brightness-90 contrast-115"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = TACTICAL_IMAGE_FALLBACK;
                  }}
                />
              ) : (
                <div className="text-xs font-mono text-slate-400">BRAK ZOBRAZOWANIA WIDEO</div>
              )}

              {/* Tactical HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[11px] font-mono text-cyan-300 bg-black/80 px-2.5 py-1 rounded backdrop-blur border border-slate-700/60">
                  <span>SENSOR: ZOBRAZOWANIE DRONOWE (DEMO)</span>
                  <span className="font-bold text-emerald-400">PEWNOŚĆ DETEKCJI: {alert.droneConfidence}%</span>
                </div>

                <div className="border border-cyan-400/60 rounded bg-cyan-500/10 p-2 flex flex-col justify-between h-28 my-auto">
                  <div className="flex justify-between text-[10px] font-mono text-cyan-300 font-bold">
                    <span className="bg-cyan-950/80 px-1 border border-cyan-400/40">ZAGROŻENIE: {alert.category}</span>
                    <span>[PRIORYTET: {alert.priorityScore}/100]</span>
                  </div>
                  <div className="text-center font-mono text-xs text-cyan-300 opacity-80">+ + +</div>
                  <div className="text-[10px] font-mono text-cyan-300 text-right">
                    GPS: {alert.coordinates[0].toFixed(4)}N, {alert.coordinates[1].toFixed(4)}E
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 bg-black/80 px-2 py-0.5 rounded backdrop-blur">
                  <span>CZAS: {alert.timestamp}</span>
                  <span>PLATFORMA: BIELIK-1 (TRYB SYMULACJI)</span>
                </div>
              </div>
            </div>

            {/* Metadane źródłowe i czas */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Lokalizacja:
                </span>
                <span className="font-mono font-semibold text-slate-200 text-right">
                  {alert.location || alert.locationName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Czas wykrycia:
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {alert.timestamp || alert.detectedAt}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Źródło informacji:
                </span>
                <span className="font-mono text-slate-300 text-right text-[11px]">
                  Dron BIELIK-1 + IMGW + BDOT10k
                </span>
              </div>

              <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
                {alert.evidence}
              </div>
            </div>
          </div>

          {/* Prawa kolumna: Why This Matters, Zmiana od ostatniego przelotu, Dane pomocnicze, Rekomendacja (7 kolumn) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* SEKCJA: DLACZEGO TO KLUCZOWE */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>DLACZEGO TO KLUCZOWE (OCENA SYTUACYJNA)</span>
              </div>
              <p className="text-xs text-rose-100 font-medium leading-relaxed">
                {alert.whyThisMatters}
              </p>
            </div>

            {/* SEKCJA: ZMIANA OD OSTATNIEGO PRZELOTU (DYNAMICS) */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>ZMIANA OD OSTATNIEGO PRZELOTU DRONA:</span>
              </div>
              <p className="text-xs text-cyan-100 leading-relaxed">
                {alert.changeSinceLastFlight}
              </p>
            </div>

            {/* SEKCJA: DANE POMOCNICZE (AUXILIARY DATA GRID) */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dane pomocnicze i kontekst przestrzenny:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {alert.auxiliaryData && alert.auxiliaryData.map((aux, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-mono">{aux.label}</div>
                    <div className="font-mono font-bold text-slate-200 mt-0.5">{aux.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEKCJA: REKOMENDOWANE DZIAŁANIE */}
            <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  <span>⚡ REKOMENDOWANE DZIAŁANIE (REKOMENDACJA SYSTEMOWA)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {alert.uncertaintyMargin}
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-100 leading-relaxed">
                {alert.recommendedAction}
              </p>
            </div>

            {/* Status przydzielonego zespołu */}
            {alert.assignedTeam && (
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs flex items-center justify-between text-emerald-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Przydzielony zespół ratowniczy:
                </span>
                <span className="font-bold">{alert.assignedTeam}</span>
              </div>
            )}
          </div>
        </div>

        {/* DOLNY PASEK AKCJI OPERACYJNYCH */}
        <div className="px-5 py-3.5 bg-[#090e18] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Przycisk 1: Mark as acknowledged */}
            {/* Przycisk 1: Potwierdź odbiór alertu */}
            <button
              onClick={() => onAcknowledge(alert.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition cursor-pointer border ${
                alert.isAcknowledged
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Potwierdź przyjęcie informacji przez sztab"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{alert.isAcknowledged ? 'Zatwierdzone' : 'Potwierdź odbiór alertu'}</span>
            </button>

            {/* Przycisk 2: Zadysponuj zespół (ze sprawdzeniem dostępności sił i blokadą double-dispatch) */}
            {alert.status === 'DISPATCHED' || alert.operatorDecision === 'DISPATCHED' ? (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold shadow">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zadysponowano: {alert.assignedTeam ? alert.assignedTeam.split('(')[0].trim() : 'Zespół ratowniczy'}</span>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition cursor-pointer shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Zadysponuj zespół</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTeamDropdown ? 'rotate-90' : ''}`} />
                </button>

                {showTeamDropdown && (
                  <div className="absolute bottom-full mb-2 left-0 w-88 bg-slate-900 border border-cyan-500/50 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="text-[11px] font-mono text-slate-300 px-2 py-1 uppercase font-bold flex justify-between border-b border-slate-800 pb-1">
                      <span>Dostępne siły i środki:</span>
                      <span className="text-cyan-400">STAN SZTABU (SOP)</span>
                    </div>
                    {AVAILABLE_TEAMS.map((team) => {
                      const res = resources.find(r => r.type === team.type);
                      const isAvailable = res ? res.available > 0 : true;

                      return (
                        <button
                          key={team.name}
                          disabled={!isAvailable}
                          onClick={() => {
                            if (!isAvailable) return;
                            onAssignTeam(alert.id, team.name);
                            setShowTeamDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded text-xs font-mono transition flex items-center justify-between ${
                            isAvailable
                              ? 'hover:bg-slate-800 text-slate-200 cursor-pointer'
                              : 'opacity-40 text-slate-500 cursor-not-allowed bg-slate-950/40'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{team.name}</span>
                            {res && (
                              <span className={`text-[10px] mt-0.5 ${res.available > 0 ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                                {res.available > 0 ? `✓ Dostępne: ${res.available} / ${res.total}` : '✕ 0 wolnych (BRAK ZASOBU W SZTABIE)'}
                              </span>
                            )}
                          </div>
                          {isAvailable ? (
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-950/60 px-1 py-0.5 rounded border border-rose-600/40">
                              BLOKADA
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Przycisk 3: PRZEKIERUJ SENSOR DRONA */}
            {onRetaskDrone && (
              <button
                onClick={() => onRetaskDrone(alert)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition cursor-pointer border ${
                  isRetasked
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-300 shadow-md active:scale-95'
                }`}
                title="Skieruj sensor drona bezpośrednio na współrzędne tego zagrożenia"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>{isRetasked ? '✓ SENSOR PRZEKIEROWANY' : 'PRZEKIERUJ SENSOR DRONA'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Przycisk: Pokaż na mapie */}
            <button
              onClick={() => {
                onShowOnMap(alert);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-cyan-950/70 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 font-mono text-xs font-bold transition cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Pokaż na mapie</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold transition cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
