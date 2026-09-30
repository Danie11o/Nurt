import React from 'react';
import {
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Radio, 
  UploadCloud, 
  Cpu, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Eye,
} from 'lucide-react';

export interface DemoStepInfo {
  step: number;
  timeStep: '12:00' | '12:15' | '12:30' | '12:45';
  title: string;
  badge: string;
  description: string;
  speakerCue: string;
  icon: React.ReactNode;
}

export const DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    timeStep: '12:00',
    title: 'Potrzeba operacyjna sztabu',
    badge: 'KROK 1/8 • POTRZEBA',
    description: 'Dyżurny musi sprawdzić, czy jedyna droga do odciętej zabudowy pozostaje przejezdna.',
    speakerCue: '„Nie zaczynamy od drona. Zaczynamy od pytania dyżurnego: czy ratownicy dojadą do mieszkańców?”',
    icon: <Eye className="w-4 h-4 text-blue-400" />,
  },
  {
    step: 2,
    timeStep: '12:15',
    title: 'Zadanie rozpoznania dla operatora',
    badge: 'KROK 2/8 • LOT-01',
    description: 'Operator otrzymuje punkt, pytanie operacyjne i zakres obserwacji. Dron zbiera świeży obraz trudno dostępnego odcinka.',
    speakerCue: '„Dron ma tu główną rolę: dostarcza aktualny obraz miejsca, do którego patrol nie może szybko dotrzeć.”',
    icon: <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />,
  },
  {
    step: 3,
    timeStep: '12:15',
    title: 'Import obserwacji z lotu',
    badge: 'KROK 3/8 • DANE Z DRONA',
    description: 'Pakiet demonstracyjny zachowuje identyfikator lotu, czas, lokalizację i ocenę pewności operatora.',
    speakerCue: '„Każdy kadr pozostaje połączony ze źródłem, czasem i miejscem. Jury widzi, skąd pochodzi informacja.”',
    icon: <UploadCloud className="w-4 h-4 text-emerald-400 animate-bounce" />,
  },
  {
    step: 4,
    timeStep: '12:15',
    title: 'Obserwacja staje się kartą sprawy',
    badge: 'KROK 4/8 • PORZĄDKOWANIE',
    description: 'System porównuje loty i porządkuje obserwację. W demo analiza jest deterministyczną symulacją, a nie działającym modelem AI.',
    speakerCue: '„Nie udajemy gotowego AI. Pokazujemy bezpieczny przepływ, do którego później można podłączyć zweryfikowany model.”',
    icon: <Cpu className="w-4 h-4 text-amber-400 animate-spin" />,
  },
  {
    step: 5,
    timeStep: '12:30',
    title: 'Zmiana od poprzedniego lotu',
    badge: 'KROK 5/8 • PORÓWNANIE',
    description: 'Warstwa zalewowa aktualizuje się o +18%. Droga DW-878 staje się nieprzejezdna, Most Karpacki zagrożony.',
    speakerCue: '„Mapa operacyjna natychmiast ujawnia dynamikę: widzimy rozlanie wody i odcięcie kluczowych szlaków dojazdowych.”',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  },
  {
    step: 6,
    timeStep: '12:30',
    title: 'Priorytet z uzasadnieniem',
    badge: 'KROK 6/8 • PRIORYTET',
    description: 'Jawny scoring porządkuje sprawy według zagrożenia życia, przejezdności, infrastruktury i jakości obserwacji.',
    speakerCue: '„To nie czarna skrzynka. Dyżurny widzi wynik, dowody i składniki punktacji.”',
    icon: <ShieldAlert className="w-4 h-4 text-orange-400" />,
  },
  {
    step: 7,
    timeStep: '12:30',
    title: 'Decyzja człowieka',
    badge: 'KROK 7/8 • HUMAN-IN-THE-LOOP',
    description: 'Dyżurny zatwierdza blokadę drogi, przypisuje sprawę zespołowi i zleca ponowny lot. System nie wysyła rozkazu samodzielnie.',
    speakerCue: '„System rekomenduje następny krok, ale odpowiedzialność pozostaje po stronie człowieka.”',
    icon: <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />,
  },
  {
    step: 8,
    timeStep: '12:30',
    title: 'LOT-02 zamyka pętlę',
    badge: 'KROK 8/8 • ZWERYFIKOWANO',
    description: 'Ponowny lot o 12:45 potwierdza utrzymywanie się wody. Sprawa dostaje nowy czas, źródło i status do dalszego działania.',
    speakerCue: '„Innowacją jest dalszy ciąg sprawy: drugi lot potwierdza stan i chroni sztab przed decyzją na podstawie starego obrazu.”',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  },
];

interface DemoControllerProps {
  isDemoActive: boolean;
  currentStepIndex: number;
  onStopDemo: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSelectStep: (index: number) => void;
  onFinishDemo: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  isDemoActive,
  currentStepIndex,
  onStopDemo,
  onNextStep,
  onPrevStep,
  onSelectStep,
  onFinishDemo,
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const isFinalStep = currentStepIndex === DEMO_STEPS.length - 1;

  if (!isDemoActive) {
    return null;
  }

  return (
    <div className="bg-[#0b1323] border-b-2 border-amber-500/80 px-4 py-2 z-40 select-none shadow-xl shrink-0 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Lewa strona: Krok, Tytuł i Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 shrink-0">
            {currentStep.icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                {currentStep.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Czas operacyjny: <strong className="text-cyan-400">{currentStep.timeStep}</strong>
              </span>
              {isFinalStep ? (
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                  DEMO GOTOWE
                </span>
              ) : (
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded">
                  TRYB RĘCZNY • CZYTAJ I KLIKNIJ DALEJ
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide truncate">
              {currentStep.title}
            </h2>
          </div>
        </div>

        {/* Środek: Wskazówka narracyjna dla prezentera / jury */}
        <div className="hidden xl:flex items-center gap-2 max-w-xl px-3 py-1 rounded bg-slate-900/90 border border-slate-700/80 text-xs text-amber-200/90 italic">
          <span className="font-bold text-[10px] not-italic text-amber-400 uppercase font-mono px-1 rounded bg-amber-950/60 border border-amber-600/30">
            PITCH CUE
          </span>
          <span className="truncate">{currentStep.speakerCue}</span>
        </div>

        {/* Prawa strona: Przyciski sterowania ręcznego */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
          {/* Poprzedni krok */}
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className={`p-1.5 rounded border text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1 ${
              currentStepIndex === 0
                ? 'opacity-30 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="Poprzedni krok"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">PREV</span>
          </button>

          {/* Następny krok (NEXT STEP) */}
          <button
            onClick={isFinalStep ? onFinishDemo : onNextStep}
            className={`px-3 py-1.5 rounded border text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 shadow-sm ${
              isFinalStep
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
            }`}
            title={isFinalStep ? 'Zakończ prezentację i pozostaw stan końcowy na mapie' : 'Przejdź do następnego kroku'}
          >
            <span className="text-[11px]">{isFinalStep ? 'ZAKOŃCZ DEMO' : 'NEXT STEP'}</span>
            {isFinalStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Reset / Stop Demo */}
          <button
            onClick={onStopDemo}
            className="p-1.5 px-2.5 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-rose-100 text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1"
            title="Resetuj i zakończ Demo"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px]">RESET DEMO</span>
          </button>
        </div>
      </div>

      {/* Pasek postępu kroków (8 kafelków) */}
      <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center gap-1.5">
        {DEMO_STEPS.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          const isFinalCurrent = isCurrent && idx === DEMO_STEPS.length - 1;

          return (
            <button
              key={step.step}
              onClick={() => onSelectStep(idx)}
              className="flex-1 group text-left cursor-pointer transition focus:outline-none"
              title={`${step.badge}: ${step.title}`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[9px] font-mono tracking-wider ${
                  isFinalCurrent ? 'text-emerald-400 font-bold' : isCurrent ? 'text-amber-400 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  0{step.step}
                </span>
                <span className="text-[8px] font-mono text-slate-500 hidden lg:inline">
                  {step.timeStep}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-800">
                <div 
                  className={`h-full transition-all duration-200 ${
                    isDone || isFinalCurrent
                      ? 'bg-emerald-500 w-full' 
                      : isCurrent 
                        ? 'bg-amber-400' 
                        : 'w-0'
                  }`}
                  style={{ width: isCurrent || isDone ? '100%' : '0%' }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
