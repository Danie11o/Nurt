import React from 'react';
import { X, Printer, Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { AlertIncident, DroneMission, TimeStep, OperationalProfile } from '../types';

interface SitrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertIncident[];
  drone: DroneMission;
  activeTimeStep: TimeStep;
  profile?: OperationalProfile;
}

export const SitrepModal: React.FC<SitrepModalProps> = ({
  isOpen,
  onClose,
  alerts,
  drone,
  activeTimeStep,
  profile = 'CIVIL',
}) => {
  if (!isOpen) return null;

  const isDualUse = profile === 'DUAL_USE';

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div 
        className="w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isDualUse ? 'text-amber-400' : 'text-blue-400'}`} />
            <div>
              <h2 className="text-sm font-bold text-white font-mono tracking-wide">
                {isDualUse ? 'MELDUNEK OPERACYJNY DUAL-USE #FL-2026/09' : 'MELDUNEK SYTUACYJNY (SITREP) #FL-2026/09'}
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                {isDualUse 
                  ? 'Zabezpieczenie Logistyczne Szlaków MSR i Wsparcie WOT (3. PBOT / MON)' 
                  : 'Wojewódzki / Gminny Sztab Zarządzania Kryzysowego (PSP / OSP / WCZK)'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Treść raportu */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-300 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">CZAS RAPORTU:</span>
              <span className="text-amber-400 font-bold">{activeTimeStep} CEST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">STATUS ROZPOZNANIA:</span>
              <span className="text-emerald-400 font-bold">{drone.callsign} — AKTYWNY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">POWIERZCHNIA MONITOROWANA:</span>
              <span className="text-slate-200">{drone.totalAreaSqKm} km² ({drone.analyzedAreasCount} sektorów)</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200 mb-2">
              1. Zidentyfikowane Zagrożenia i Dyspozycje Sztabowe:
            </h3>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-mono font-bold">
                    <span className={alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-orange-400'}>
                      [{alert.severity}] {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      STATUS: {alert.status === 'DISPATCHED' ? 'ZADYSPONOWANO' : 'OCZEKUJE'}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Lokalizacja: {alert.location || alert.locationName}
                  </div>
                  <div className="text-slate-200 text-[11px] font-medium pt-1">
                    Rekomendacja: {alert.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200 mb-2">
              2. Stan Gotowości i Zaangażowane Służby:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">PSP / OSP:</span> 6 zastępów, 3 łodzie
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">Partner operacyjny:</span> 1 pojazd terenowy
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">Policja (KPP):</span> 4 radiowozy (blokady dróg)
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">PGE Dystrybucja:</span> Pogotowie energetyczne GPZ
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            NURT C2 • Raport demonstracyjny
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Drukuj / Zapisz PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
