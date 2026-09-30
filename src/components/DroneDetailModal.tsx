import React from 'react';
import { 
  X, 
  Crosshair, 
  Cpu, 
  CheckCircle2, 
  Send,
  AlertTriangle,
  Bot,
  UserCheck,
  FileSearch
} from 'lucide-react';
import { AlertIncident } from '../types';
import { TACTICAL_IMAGE_FALLBACK } from '../data/mockData';

interface DroneDetailModalProps {
  alert: AlertIncident | null;
  onClose: () => void;
  onDispatch: (alertId: string) => void;
}

export const DroneDetailModal: React.FC<DroneDetailModalProps> = ({
  alert,
  onClose,
  onDispatch,
}) => {
  if (!alert) return null;

  const isApproved = alert.status === 'DISPATCHED' || alert.operatorDecision === 'APPROVED';

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div 
        className="w-full max-w-3xl bg-[#0e1420] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modala */}
        <div className="px-4 py-3 bg-[#0a0f18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
              <Crosshair className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Inspekcja Dronowa • Kadr Rozpoznawczy
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {alert.id}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300">
                  {alert.severity} ({alert.priorityScore}/100)
                </span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {alert.title} — {alert.location || alert.locationName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ciało Modala: Kadr + Szczegóły taktyczne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Lewa kolumna: Kadr z drona z naniesionym HUD i ramką detekcji AI */}
          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-video md:aspect-auto md:h-80 flex items-center justify-center">
            {alert.droneImage ? (
              <img 
                src={alert.droneImage} 
                alt="Rozpoznanie dronowe" 
                className="w-full h-full object-cover filter brightness-90 contrast-110"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = TACTICAL_IMAGE_FALLBACK;
                }}
              />
            ) : (
              <div className="text-xs font-mono text-slate-400">BRAK PODGLĄDU WIDEO</div>
            )}

            {/* Tactical HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
              {/* Góra HUD */}
              <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded backdrop-blur">
                <span>SENSOR: EO/IR 4K ZOOM</span>
                <span className="font-bold text-emerald-400">AI CONF: {alert.droneConfidence}%</span>
              </div>

              {/* Ramka detekcji celowniczej (Bounding box) */}
              <div className="absolute inset-8 md:inset-10 border-2 border-cyan-400/80 rounded bg-cyan-500/10 flex flex-col justify-between p-2">
                <div className="flex justify-between items-start text-[9px] font-mono text-cyan-300 font-bold">
                  <span className="bg-cyan-950/80 px-1 border border-cyan-400/40">
                    DETEKCJA: {alert.category}
                  </span>
                  <span>[SCORE: {alert.priorityScore}]</span>
                </div>
                <div className="text-center font-mono text-[10px] text-cyan-300">
                  + + +
                </div>
                <div className="text-[9px] font-mono text-cyan-300 text-right">
                  GPS: {alert.coordinates[0].toFixed(4)}N, {alert.coordinates[1].toFixed(4)}E
                </div>
              </div>

              {/* Dół HUD */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-1 rounded backdrop-blur">
                <span>CZAS: {alert.timestamp || alert.detectedAt}</span>
                <span>PLATFORMA: BIELIK-1</span>
              </div>
            </div>
          </div>

          {/* Prawa kolumna: Uzasadnienie, Materiał Dowodowy, Rekomendacja i Decyzja */}
          <div className="flex flex-col justify-between space-y-2.5">
            <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
              {/* Przyczyna (Reason) */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ocena Zagrożenia i Przyczyna Alertu (Reason)</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {alert.reason || alert.description}
                </p>
              </div>

              {/* Materiał dowodowy (Evidence) */}
              <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Materiał Dowodowy Sensorów (Evidence)</span>
                </div>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  {alert.evidence}
                </p>
              </div>

              {/* Rekomendacja Algorytmiczna */}
              <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    AI / Rekomendacja Systemowa
                  </span>
                  <span className="text-slate-400 font-normal">
                    {alert.uncertaintyMargin}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                  {alert.recommendedAction}
                </p>
              </div>

              {/* Informacja o roli człowieka */}
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Ostateczna decyzja: operator ludzki zatwierdza dyspozycję sił i środków.</span>
              </div>
            </div>

            {/* Przyciski Decyzji */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onDispatch(alert.id);
                  onClose();
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isApproved
                    ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                }`}
              >
                {isApproved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>DYSPOZYCJA ZATWIERDZONA (W TOKU)</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ZATWIERDŹ DECYZJĘ DOWÓDCY</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
