import React from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  ShieldAlert, 
  Car, 
  Home, 
  User, 
  Waves, 
  HelpCircle, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { MapSelectedItem } from '../types';
import { TACTICAL_IMAGE_FALLBACK } from '../data/mockData';

interface MapDetailDrawerProps {
  selectedItem: MapSelectedItem | null;
  onClose: () => void;
  onDispatch: (id: string, kind: string) => void;
}

export const MapDetailDrawer: React.FC<MapDetailDrawerProps> = ({
  selectedItem,
  onClose,
  onDispatch,
}) => {
  if (!selectedItem) return null;

  const renderContent = () => {
    switch (selectedItem.kind) {
      case 'ROAD': {
        const road = selectedItem.data;
        const statusColors = {
          PASSABLE: { bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400', label: 'PRZEJEZDNA' },
          THREATENED: { bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400', label: 'ZAGROŻONA' },
          IMPASSABLE: { bg: 'bg-rose-950/40 border-rose-500/40 text-rose-400', label: 'NIEPRZEJEZDNA' },
        }[road.status];

        return (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  SEKTOR DROGOWY • {road.roadNumber}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColors.bg}`}>
                {statusColors.label}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <h3 className="text-sm font-bold text-white">{road.name}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Długość odcinka: {road.lengthKm} km • Ostatnia inspekcja: {road.lastInspectionTime}
                </div>
              </div>

              {road.waterDepthCm !== undefined && (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Poziom wody na jezdni:</span>
                  <span className={`font-mono font-bold ${road.waterDepthCm > 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {road.waterDepthCm} cm ({road.waterDepthCm > 30 ? 'BLOKADA CAŁKOWITA' : 'TYLKO POJAZDY RATOWNICZE'})
                  </span>
                </div>
              )}

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Raport Sytuacyjny z Drona:</div>
                <div className="text-slate-300 leading-relaxed">{road.description}</div>
              </div>

              {road.recommendedDetour && (
                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-600/30 text-xs space-y-1">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Wyznaczony Objazd / Korytarz:</div>
                  <div className="text-slate-200 font-medium">{road.recommendedDetour}</div>
                </div>
              )}

              <button
                onClick={() => onDispatch(road.id, 'ROAD')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ZATWIERDŹ DYREKTYWĘ RUCHU DLA KPP</span>
              </button>
            </div>
          </>
        );
      }

      case 'BUILDING': {
        const bld = selectedItem.data;
        const statusColors = {
          SAFE: { bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400', label: 'BEZPIECZNY' },
          THREATENED: { bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400', label: 'ZAGROŻONY' },
          INSPECTION_PRIORITY: { bg: 'bg-rose-950/40 border-rose-500/40 text-rose-400', label: 'PRIORYTET KONTROLI' },
        }[bld.status];

        return (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  OBIEKT BUDOWLANY • {bld.buildingType}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColors.bg}`}>
                {statusColors.label}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <h3 className="text-sm font-bold text-white">{bld.address}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: {bld.id} • GPS: {bld.coordinates[0].toFixed(4)}, {bld.coordinates[1].toFixed(4)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Mieszkańcy:</div>
                  <div className="font-mono font-bold text-slate-200">{bld.residentsReported} osób</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Woda od obiektu:</div>
                  <div className="font-mono font-bold text-amber-300">
                    {bld.waterDistanceM === 0 ? 'WODA W BUDYNKU' : `${bld.waterDistanceM} m`}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Ocena Ryzyka i Stan Obiektu:</div>
                <div className="text-slate-300 leading-relaxed">{bld.hazardNotes}</div>
              </div>

              <div className="p-2.5 rounded bg-amber-950/20 border border-amber-600/30 text-xs space-y-1">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Rekomendacja Sztabowa:</div>
                <div className="text-slate-200 font-medium">{bld.recommendedAction}</div>
              </div>

              <button
                onClick={() => onDispatch(bld.id, 'BUILDING')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SKIERUJ ZESPÓŁ RATOWNICZY / EWAKUACJA</span>
              </button>
            </div>
          </>
        );
      }

      case 'DETECTION': {
        const det = selectedItem.data;
        const typeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
          PERSON: { label: 'MOŻLIWA OSOBA', icon: <User className="w-4 h-4" />, color: 'text-rose-400 border-rose-500/40 bg-rose-950/40' },
          VEHICLE: { label: 'POJAZD', icon: <Car className="w-4 h-4" />, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' },
          OBSTACLE: { label: 'PRZESZKODA', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
          INFRASTRUCTURE_DAMAGE: { label: 'USZKODZONA INFRASTRUKTURA', icon: <ShieldAlert className="w-4 h-4" />, color: 'text-purple-400 border-purple-500/40 bg-purple-950/40' },
        };

        const config = typeLabels[det.type] || { label: 'DETEKCJA', icon: <HelpCircle className="w-4 h-4" />, color: 'text-slate-400' };

        return (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {config.icon}
                <span className="text-xs font-mono font-bold text-slate-200">
                  WYKRYCIE Z DRONA • {det.id}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${config.color}`}>
                {config.label}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Podgląd kadru */}
              <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 h-36">
                <img 
                  src={det.imageUrl} 
                  alt={det.title} 
                  className="w-full h-full object-cover filter brightness-90 contrast-110"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = TACTICAL_IMAGE_FALLBACK;
                  }}
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur border border-slate-700 text-[9px] font-mono text-cyan-300">
                  SENSOR: {det.sensor}
                </div>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur border border-emerald-500/50 text-[9px] font-mono text-emerald-400 font-bold">
                  AI PEWNOŚĆ: {det.confidence}%
                </div>
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-mono text-slate-300">
                  Dron: {det.droneCallsign} • {det.detectedAt}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{det.title}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  GPS: {det.coordinates[0].toFixed(4)}N, {det.coordinates[1].toFixed(4)}E
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Analiza Obrazowa AI:</div>
                <div className="text-slate-300 leading-relaxed">{det.description}</div>
              </div>

              <div className="p-2.5 rounded bg-amber-950/20 border border-amber-600/30 text-xs space-y-1">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Rekomendacja dla Dowódcy:</div>
                <div className="text-slate-200 font-medium">{det.recommendedAction}</div>
              </div>

              <button
                onClick={() => onDispatch(det.id, 'DETECTION')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ZATWIERDŹ AKCJĘ RATOWNICZĄ</span>
              </button>
            </div>
          </>
        );
      }

      case 'FLOOD': {
        const flood = selectedItem.data;
        return (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  STREFA ZALEWOWA • {flood.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-cyan-950/40 border-cyan-500/40 text-cyan-400">
                STAN WODY: {flood.waterLevelDelta}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Powierzchnia zalana:</div>
                  <div className="font-mono font-bold text-cyan-300">{flood.areaHectares} ha</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Głębokość maks:</div>
                  <div className="font-mono font-bold text-rose-400">{flood.depthMaxM} m</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Głębokość średnia:</div>
                  <div className="font-mono font-bold text-slate-200">{flood.depthAvgM} m</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Prędkość nurtu:</div>
                  <div className="font-mono font-bold text-amber-300">{flood.currentVelocityMs} m/s</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Źródło Zobrazowania:</div>
                <div className="text-slate-300">
                  Fuzja danych z drona BIELIK-1 (fotogrametria RGB) + satelitarnej maski radarowej SAR Copernicus EMS.
                </div>
              </div>
            </div>
          </>
        );
      }

      case 'ALERT': {
        const alert = selectedItem.data;
        const isDispatched = alert.status === 'DISPATCHED' || alert.operatorDecision === 'APPROVED';

        return (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  ALERT SZTABOWY • {alert.id}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-rose-950/40 border-rose-500/40 text-rose-400">
                  {alert.severity}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                  SCORE: {alert.priorityScore}/100
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div>
                <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Lokalizacja: {alert.location || alert.locationName} • Czas: {alert.timestamp || alert.detectedAt}
                </div>
              </div>

              {/* Przyczyna (Reason) */}
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Przyczyna Alertu (Reason):</div>
                <div className="text-slate-200 leading-relaxed">{alert.reason || alert.description}</div>
              </div>

              {/* Materiał dowodowy (Evidence) */}
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="text-[9px] text-cyan-400 uppercase font-bold">Materiał Dowodowy (Evidence):</div>
                <div className="text-slate-300 leading-normal">{alert.evidence}</div>
              </div>

              {/* Rekomendacja AI */}
              <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  <span>🤖 Rekomendacja Algorytmiczna:</span>
                  <span className="text-slate-400 font-normal">{alert.uncertaintyMargin}</span>
                </div>
                <div className="text-slate-200 font-medium">{alert.recommendedAction}</div>
              </div>

              {/* Decyzja Człowieka (Human in the loop) */}
              <div className="p-2.5 rounded bg-amber-950/20 border border-amber-600/30 text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
                  <span className="text-amber-400">👤 Ostateczna Decyzja: Operator</span>
                  <span className={isDispatched ? 'text-emerald-400' : 'text-amber-400'}>
                    {isDispatched ? 'ZATWIERDZONO' : 'WYMAGA ZATWIERDZENIA'}
                  </span>
                </div>

                <button
                  onClick={() => onDispatch(alert.id, 'ALERT')}
                  className={`w-full py-2 px-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDispatched
                      ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatched ? 'DYSPOZYCJA W TOKU' : 'ZATWIERDŹ DECYZJĘ DOWÓDCY'}</span>
                </button>
              </div>
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="absolute right-4 top-4 bottom-14 w-84 sm:w-96 z-30 bg-[#0c121d]/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Pasek górny drawer */}
      <div className="px-4 py-2.5 bg-[#090e17] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
            Inspektor Obiektu Mapowego
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Ciało szczegółów */}
      <div className="p-4 flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Stopka */}
      <div className="px-4 py-2 bg-[#090e17] border-t border-slate-800/80 text-[9px] font-mono text-slate-400 flex justify-between items-center shrink-0">
        <span>NURT C2 • SCENARIUSZ SYNTETYCZNY</span>
        <span className="text-emerald-400 font-bold">FUZJA GEOPORTAL + DRON</span>
      </div>
    </div>
  );
};
