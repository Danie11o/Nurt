import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crosshair,
  Eye,
  Navigation,
  Radio,
  Route,
  Waves,
  X,
  Zap,
} from 'lucide-react';
import { DEMO_STEPS } from './DemoController';

const LOOK_AT = [
  'Niebieski obszar zalania i jedyną drogę prowadzącą do zabudowy.',
  'Pozycję UAV-01 oraz korytarz lotu zaznaczony na mapie.',
  'Powiązanie obserwacji z numerem lotu, czasem i lokalizacją.',
  'Kartę sprawy — wynik nadal wymaga zatwierdzenia przez człowieka.',
  'Nowy zasięg wody oraz odcinek drogi oznaczony jako nieprzejezdny.',
  'Zakładkę „Priorytety”: wynik 96/100 wraz z jawnym uzasadnieniem.',
  'Alert na mapie. Kliknij go, aby sprawdzić dowody i podjąć decyzję.',
  'Nowy czas obserwacji 12:45 — LOT-02 potwierdza, że blokada nadal trwa.',
];

type VisualKind = 'WATER' | 'ALERT' | 'DRONE' | 'ROUTE' | 'OBSERVATION' | 'SENSOR' | 'ROAD_CLOSED' | 'CRITICAL' | 'TARGET' | 'TIME' | 'VERIFIED';

const MAP_VISUALS: { kind: VisualKind; label: string }[][] = [
  [
    { kind: 'WATER', label: 'Zasięg wody' },
    { kind: 'ALERT', label: 'Znana sprawa ALT' },
  ],
  [
    { kind: 'DRONE', label: 'UAV-01' },
    { kind: 'ROUTE', label: 'Trasa lotu' },
  ],
  [
    { kind: 'OBSERVATION', label: 'Punkt obserwacji' },
    { kind: 'ROUTE', label: 'Powiązanie z lotem' },
  ],
  [
    { kind: 'SENSOR', label: 'Obserwacja sensora' },
    { kind: 'ALERT', label: 'Karta sprawy ALT' },
  ],
  [
    { kind: 'WATER', label: 'Nowy zasięg wody' },
    { kind: 'ROAD_CLOSED', label: 'Droga zamknięta' },
  ],
  [
    { kind: 'CRITICAL', label: 'Priorytet krytyczny' },
    { kind: 'ALERT', label: 'Priorytet wysoki' },
  ],
  [
    { kind: 'TARGET', label: 'Wybrana sprawa' },
    { kind: 'CRITICAL', label: 'Decyzja operatora' },
  ],
  [
    { kind: 'TIME', label: 'Nowa obserwacja 12:45' },
    { kind: 'VERIFIED', label: 'Stan potwierdzony' },
  ],
];

const MapSymbol: React.FC<{ kind: VisualKind }> = ({ kind }) => {
  const base = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-inner';

  switch (kind) {
    case 'WATER':
      return <span className={`${base} border-sky-400/70 bg-sky-500/35 text-sky-200`}><Waves className="h-4 w-4" /></span>;
    case 'ALERT':
      return <span className={`${base} rounded-full border-amber-300 bg-amber-500 text-slate-950`}><AlertTriangle className="h-4 w-4 fill-current" /></span>;
    case 'DRONE':
      return <span className={`${base} rounded-full border-cyan-300 bg-cyan-500 text-slate-950`}><Navigation className="h-4 w-4 fill-current" /></span>;
    case 'ROUTE':
      return <span className={`${base} border-cyan-400/60 bg-cyan-950/60 text-cyan-300`}><Route className="h-4 w-4" /></span>;
    case 'OBSERVATION':
      return <span className={`${base} rounded-full border-cyan-300 bg-slate-950 text-cyan-300`}><Radio className="h-4 w-4" /></span>;
    case 'SENSOR':
      return <span className={`${base} rounded-full border-violet-300 bg-violet-600 text-white`}><Zap className="h-4 w-4 fill-current" /></span>;
    case 'ROAD_CLOSED':
      return <span className={`${base} border-rose-500/60 bg-rose-950/60`}><span className="w-5 border-b-2 border-dashed border-rose-400" /></span>;
    case 'CRITICAL':
      return <span className={`${base} rounded-full border-rose-300 bg-rose-600 text-white`}><AlertCircle className="h-4 w-4" /></span>;
    case 'TARGET':
      return <span className={`${base} rounded-full border-rose-400 bg-rose-950/70 text-rose-300`}><Crosshair className="h-5 w-5" /></span>;
    case 'TIME':
      return <span className={`${base} border-cyan-400/60 bg-cyan-950/60 text-cyan-300`}><Clock3 className="h-4 w-4" /></span>;
    case 'VERIFIED':
      return <span className={`${base} rounded-full border-emerald-300 bg-emerald-500 text-slate-950`}><CheckCircle2 className="h-4 w-4" /></span>;
  }
};

interface DemoGuidanceCardProps {
  stepIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export const DemoGuidanceCard: React.FC<DemoGuidanceCardProps> = ({ stepIndex, onClose, onPrev, onNext, onFinish }) => {
  const step = DEMO_STEPS[stepIndex] || DEMO_STEPS[0];
  const isFinalStep = stepIndex === DEMO_STEPS.length - 1;

  return (
    <section className="absolute bottom-16 left-3 z-[650] w-[min(31rem,calc(100%-1.5rem))] rounded-xl border border-amber-400/60 bg-slate-950/94 p-3 shadow-2xl backdrop-blur-xl animate-fadeIn pointer-events-auto">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-400/10">
          {step.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-amber-400">
                Przewodnik demo · krok {step.step}/8
              </div>
              <h3 className="mt-0.5 text-sm font-bold text-white">{step.title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white cursor-pointer"
              aria-label="Zamknij przewodnik demo"
              title="Zamknij wskazówkę"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-300">{step.description}</p>

          <div className="mt-2 flex items-start gap-2 rounded-lg border border-cyan-500/25 bg-cyan-950/35 px-2.5 py-2">
            <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">Na co patrzeć</div>
              <div className="mt-0.5 text-[11px] leading-relaxed text-cyan-50">{LOOK_AT[stepIndex]}</div>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-violet-500/25 bg-violet-950/30 px-2.5 py-2">
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-violet-300">Co pojawiło się na mapie</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {MAP_VISUALS[stepIndex].map((item) => (
                <div key={`${item.kind}-${item.label}`} className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-950/70 p-1.5">
                  <MapSymbol kind={item.kind} />
                  <span className="text-[10px] font-semibold leading-tight text-slate-100">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Wstecz
            </button>
            <span className="text-[9px] font-mono text-slate-500">Krok nie zmieni się sam</span>
            <button
              type="button"
              onClick={isFinalStep ? onFinish : onNext}
              className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                isFinalStep
                  ? 'border-emerald-400 bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'border-amber-400 bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}
            >
              {isFinalStep ? 'Zakończ demo' : 'Dalej'}
              {isFinalStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
