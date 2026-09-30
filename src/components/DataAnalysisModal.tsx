import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  Bell, 
  Play, 
  Check, 
  Clock, 
  Camera, 
  Sliders, 
  Crosshair, 
  Globe2, 
  GitCompare, 
  Activity,
  ArrowRight,
  Code2
} from 'lucide-react';
import { TimeStep } from '../types';
import { DemoAnalysisPipeline } from '../modules/analysis/mockPipeline';
import { PipelineExecutionResult } from '../modules/analysis/types';
import { TACTICAL_IMAGE_FALLBACK } from '../data/mockData';

interface DataAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTimeStep: TimeStep;
}

type PipelineStepKey = 
  | 'IMAGERY' 
  | 'PREPROCESSING' 
  | 'DETECTION' 
  | 'GEOLOCATION' 
  | 'COMPARISON' 
  | 'RISK' 
  | 'ALERTS';

interface StepDefinition {
  key: PipelineStepKey;
  number: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const STEPS: StepDefinition[] = [
  { key: 'IMAGERY', number: 1, label: 'Drone imagery', sublabel: 'Surowy kadr & telemetria', icon: <Camera className="w-3.5 h-3.5" /> },
  { key: 'PREPROCESSING', number: 2, label: 'Pre-processing', sublabel: 'Kalibracja i orto-korekcja', icon: <Sliders className="w-3.5 h-3.5" /> },
  { key: 'DETECTION', number: 3, label: 'Object / flood detection', sublabel: 'Segmentacja wody & AI Bounding Box', icon: <Crosshair className="w-3.5 h-3.5" /> },
  { key: 'GEOLOCATION', number: 4, label: 'Geolocation', sublabel: 'Rzutowanie WGS84 & BDOT10k', icon: <Globe2 className="w-3.5 h-3.5" /> },
  { key: 'COMPARISON', number: 5, label: 'Comparison with previous flight', sublabel: 'Analiza przyrostu delta-t', icon: <GitCompare className="w-3.5 h-3.5" /> },
  { key: 'RISK', number: 6, label: 'Risk assessment', sublabel: 'Macierz zagrożenia życia', icon: <Activity className="w-3.5 h-3.5" /> },
  { key: 'ALERTS', number: 7, label: 'Operational alerts', sublabel: 'Karta dyspozytorska C2', icon: <Bell className="w-3.5 h-3.5" /> },
];

export const DataAnalysisModal: React.FC<DataAnalysisModalProps> = ({
  isOpen,
  onClose,
  activeTimeStep,
}) => {
  const [selectedStep, setSelectedStep] = useState<PipelineStepKey>('DETECTION');
  const [isRunningSim, setIsRunningSim] = useState(false);

  if (!isOpen) return null;

  const result: PipelineExecutionResult = DemoAnalysisPipeline.runPipeline(activeTimeStep);

  const handleSimulate = () => {
    setIsRunningSim(true);
    let stepIndex = 0;
    const interval = setInterval(() => {
      setSelectedStep(STEPS[stepIndex].key);
      stepIndex++;
      if (stepIndex >= STEPS.length) {
        clearInterval(interval);
        setIsRunningSim(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-[#0b101b] border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modala */}
        <div className="px-5 py-3.5 bg-[#080d16] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  SYMULOWANY POTOK ANALITYCZNY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                  DEMO / MOCK ANALYSIS
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Czas symulacji: <strong className="text-emerald-400">{result.totalLatencyMs} ms</strong>
                </span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Architektura przetwarzania danych: od surowego kadru do karty decyzyjnej C2
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulate}
              disabled={isRunningSim}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold transition cursor-pointer disabled:opacity-50"
              title="Przeprowadź symulację przejścia przez 7 etapów potoku"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunningSim ? 'PRZETWARZANIE...' : 'URUCHOM POTOK (DEMO)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 7-ETAPOWY STEPPER RUROCIĄGU ANALITYCZNEGO */}
        <div className="px-5 py-3 bg-[#0a0f19] border-b border-slate-800/80 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 min-w-[780px]">
            {STEPS.map((st, idx) => {
              const isSelected = selectedStep === st.key;
              return (
                <React.Fragment key={st.key}>
                  {idx > 0 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 opacity-40" />
                  )}
                  <button
                    onClick={() => setSelectedStep(st.key)}
                    className={`flex-1 p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {st.number}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-bold truncate leading-tight font-mono">
                        {st.label}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {st.sublabel}
                      </div>
                    </div>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* GŁÓWNA CZĘŚĆ INSPEKCJI ETAPU (LEWA: WIZUALIZACJA / PRAWA: DANE TECHNICZNE) */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Lewa kolumna: Zobrazowanie danego etapu (7 kolumn) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center shadow-lg">
              <img 
                src={result.step1Raw.rgbImageUrl} 
                alt="Wizualizacja etapu" 
                className="w-full h-full object-cover filter brightness-90 contrast-110"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = TACTICAL_IMAGE_FALLBACK;
                }}
              />

              {/* Nakładki dynamiczne w zależności od wybranego etapu */}
              {selectedStep === 'IMAGERY' && (
                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between text-[10px] font-mono text-cyan-300 bg-black/70 p-1.5 rounded backdrop-blur">
                    <span>SUROWY STRUMIEŃ SENSORA 4K</span>
                    <span>GSD: {result.step1Raw.groundSampleDistanceCm} cm/px</span>
                  </div>
                  <div className="text-center font-mono text-xs text-cyan-400/80">+ + + SIATKA MATRYCY + + +</div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-300 bg-black/70 p-1.5 rounded backdrop-blur">
                    <span>PITCH: {result.step1Raw.pitchDeg}°</span>
                    <span>ALTITUDE: {result.step1Raw.altitudeM}m AGL</span>
                  </div>
                </div>
              )}

              {selectedStep === 'PREPROCESSING' && (
                <div className="absolute inset-0 bg-blue-950/20 border-2 border-dashed border-cyan-400/60 p-3 flex flex-col justify-between pointer-events-none">
                  <div className="text-[10px] font-mono text-emerald-400 bg-black/70 p-1.5 rounded w-max backdrop-blur">
                    ✓ KALIBRACJA RADIOMETRYCZNA & ORTO-REKTYFIKACJA (42ms)
                  </div>
                  <div className="text-center font-mono text-xs text-emerald-300">
                    KOREKCJA PERSPEKTYWY TERENOWEJ
                  </div>
                </div>
              )}

              {selectedStep === 'DETECTION' && (
                <div className="absolute inset-0 p-3 pointer-events-none">
                  {/* Bounding box osoby */}
                  <div className="absolute top-16 left-28 w-24 h-24 border-2 border-rose-500 bg-rose-500/20 rounded p-1 text-[9px] font-mono text-rose-300 font-bold">
                    <span>PERSON [97.4%]</span>
                  </div>
                  {/* Bounding box pojazdu */}
                  <div className="absolute bottom-12 right-20 w-32 h-20 border-2 border-cyan-400 bg-cyan-400/20 rounded p-1 text-[9px] font-mono text-cyan-300 font-bold">
                    <span>VEHICLE [94.2%]</span>
                  </div>
                  {/* Segmentacja wody */}
                  <div className="absolute bottom-4 left-6 px-2 py-1 rounded bg-black/80 border border-cyan-500 text-[10px] font-mono text-cyan-300">
                    MASK WATER RATIO: 68% KADRU (14 200 m²)
                  </div>
                </div>
              )}

              {selectedStep === 'GEOLOCATION' && (
                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none bg-indigo-950/20">
                  <div className="text-[10px] font-mono text-indigo-300 bg-black/70 p-1.5 rounded backdrop-blur">
                    RZUTOWANIE PIKSELI → WGS84 (EPSG:4326) • DOKŁADNOŚĆ: ±1.2m
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-200">
                    <span className="p-1 rounded bg-black/70">GEO-01: 50.0478N, 22.0084E (ul. Nadrzeczna)</span>
                    <span className="p-1 rounded bg-black/70">GEO-02: 50.0388N, 21.9885E (DW-878 km 14.8)</span>
                  </div>
                </div>
              )}

              {selectedStep === 'COMPARISON' && (
                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none bg-rose-950/25 border border-rose-500/40">
                  <div className="text-[10px] font-mono text-rose-300 bg-black/70 p-1.5 rounded backdrop-blur font-bold">
                    DELTA-T (12:30 vs 12:15): +77% ROZLEWISK (+63.4 ha)
                  </div>
                  <div className="text-center font-mono text-xs text-rose-400 bg-black/60 p-2 rounded">
                    NOWE ODCIĘTE SZLAKI: TRASA DW-878 ORAZ UL. NADRZECZNA
                  </div>
                </div>
              )}

              {selectedStep === 'RISK' && (
                <div className="absolute inset-0 p-3 flex flex-col justify-center items-center pointer-events-none bg-black/70 backdrop-blur-sm">
                  <div className="p-4 rounded-xl border-2 border-rose-500 bg-rose-950/60 text-center font-mono space-y-1">
                    <div className="text-xs text-slate-300 uppercase">Obliczony Wskaźnik Zagrożenia</div>
                    <div className="text-3xl font-extrabold text-rose-400">{result.step6Risk.overallRiskScore}/100</div>
                    <div className="text-xs text-rose-200 font-bold uppercase tracking-widest">{result.step6Risk.severityCalculated}</div>
                  </div>
                </div>
              )}

              {selectedStep === 'ALERTS' && (
                <div className="absolute inset-0 p-3 flex flex-col justify-center items-center pointer-events-none bg-black/70 backdrop-blur-sm">
                  <div className="p-4 rounded-xl border border-cyan-500 bg-slate-900/90 text-center font-mono space-y-1">
                    <div className="text-xs text-cyan-400 font-bold">KARTA OPERACYJNA DOWÓDCY SZTABU</div>
                    <div className="text-sm font-bold text-white">{result.step7Alert.title}</div>
                    <div className="text-xs text-amber-300">{result.step7Alert.recommendedAction}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>STAN CZASOWY: <strong className="text-cyan-300">{activeTimeStep} CEST</strong></span>
              <span>KLATKA: <strong className="text-slate-200">{result.step1Raw.frameId}</strong></span>
              <span>LATENCJA ETAPU: <strong className="text-emerald-400">
                {selectedStep === 'PREPROCESSING' ? result.step2Preprocessed.processingTimeMs :
                 selectedStep === 'DETECTION' ? result.step3Detection.processingTimeMs :
                 selectedStep === 'GEOLOCATION' ? result.step4Geolocated.processingTimeMs :
                 selectedStep === 'COMPARISON' ? result.step5Comparison.processingTimeMs :
                 selectedStep === 'RISK' ? result.step6Risk.processingTimeMs : 12} ms
              </strong></span>
            </div>
          </div>

          {/* Prawa kolumna: Szczegóły techniczne i architektura (5 kolumn) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="space-y-3 overflow-y-auto max-h-96 pr-1">
              {/* Opis etapu */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Etap {STEPS.find(s => s.key === selectedStep)?.number} / 7: {STEPS.find(s => s.key === selectedStep)?.label}
                </div>
                <div className="text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedStep === 'IMAGERY' && 'Odbiór strumienia fotogrametrycznego RGB i termowizyjnego FLIR z drona BIELIK-1 wraz z telemetrią pozycjonowania kątowego gimbalu.'}
                  {selectedStep === 'PREPROCESSING' && 'Normalizacja radiometryczna, korekta zniekształceń obiektywu, usunięcie cieni chmur i ortorektyfikacja do poziomu gruntu.'}
                  {selectedStep === 'DETECTION' && 'Uruchomienie modeli segmentacji wód powierzchniowych oraz detektorów obiektowych wykrywających ludzi, pojazdy i uszkodzenia infrastruktury.'}
                  {selectedStep === 'GEOLOCATION' && 'Transformacja współrzędnych macierzy pikseli do standardu EPSG:4326 (WGS84) oraz korelacja z wektorami dróg i budynków bazy BDOT10k.'}
                  {selectedStep === 'COMPARISON' && 'Automatyczne porównanie stanu wód z poprzednim przelotem drona (delta-t). Wykrywanie nowo odciętych kwartałów zabudowy i dróg.'}
                  {selectedStep === 'RISK' && 'Wyliczenie Priority Score (0-100) na podstawie algorytmu oceny zagrożenia życia, utraty mobilności oraz wrażliwości infrastruktury.'}
                  {selectedStep === 'ALERTS' && 'Sformatowanie gotowej karty operacyjnej z uzasadnieniem (Reason), dowodami (Evidence) i rekomendacją do zatwierdzenia przez dowódcę.'}
                </div>
              </div>

              {/* Parametry techniczne wybranego etapu */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Metadane operacyjne etapu:</span>
                </div>

                {selectedStep === 'IMAGERY' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Matryca: <span className="text-cyan-300">4K Sony Exmor (3840x2160)</span></div>
                    <div>Termowizja: <span className="text-cyan-300">FLIR Boson 640 IR</span></div>
                    <div>Pułap: <span className="text-slate-200">{result.step1Raw.altitudeM} m AGL</span></div>
                    <div>Transfer: <span className="text-emerald-400">pakiet demonstracyjny offline</span></div>
                  </div>
                )}

                {selectedStep === 'PREPROCESSING' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Kalibracja: <span className="text-emerald-400">ZATWIERDZONA (0.04s)</span></div>
                    <div>Ortorektyfikacja: <span className="text-emerald-400">UKOŃCZONA</span></div>
                    <div>Redukcja szumów: <span className="text-cyan-300">Bilateral Filter</span></div>
                  </div>
                )}

                {selectedStep === 'DETECTION' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Algorytm: <span className="text-cyan-300">{result.step3Detection.algorithmName}</span></div>
                    <div>Wykryte obiekty: <span className="text-rose-400 font-bold">3 obiekty kluczowe</span></div>
                    <div>Powierzchnia wody: <span className="text-cyan-300">{result.step3Detection.waterSurfaceEstimatedSqM} m²</span></div>
                  </div>
                )}

                {selectedStep === 'GEOLOCATION' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Układ: <span className="text-cyan-300">{result.step4Geolocated.projectionSystem}</span></div>
                    <div>Błąd pozycjonowania: <span className="text-emerald-400">±1.2 metra</span></div>
                    <div>Dopasowanie z BDOT10k: <span className="text-cyan-300">100% trafień</span></div>
                  </div>
                )}

                {selectedStep === 'COMPARISON' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Przyrost wody: <span className="text-rose-400 font-bold">+{result.step5Comparison.deltaWaterLevelCm} cm</span></div>
                    <div>Dynamika rozlewu: <span className="text-rose-400 font-bold">+{result.step5Comparison.deltaFloodedAreaSqM} m²</span></div>
                    <div>Nowe odcięcia: <span className="text-amber-400">{result.step5Comparison.newCutoffEntitiesCount} obiekty</span></div>
                  </div>
                )}

                {selectedStep === 'RISK' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Zagrożenie życia: <span className="text-rose-400">{result.step6Risk.lifeThreatScore}/40</span></div>
                    <div>Utrata mobilności: <span className="text-orange-400">{result.step6Risk.mobilityDisruptionScore}/25</span></div>
                    <div>Infrastruktura: <span className="text-amber-400">{result.step6Risk.infrastructureVulnerabilityScore}/20</span></div>
                    <div>Wiarygodność drona: <span className="text-emerald-400">{result.step6Risk.sensorConfidenceScore}/15</span></div>
                  </div>
                )}

                {selectedStep === 'ALERTS' && (
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Wygenerowany ID: <span className="text-cyan-300">{result.step7Alert.id}</span></div>
                    <div>Kwalifikacja: <span className="text-rose-400 font-bold">{result.step7Alert.severity}</span></div>
                    <div>Zasada: <span className="text-amber-300 font-bold">CZŁOWIEK W PĘTLI</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Stopka techniczna */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>ARCHITEKTURA: MODUŁOWA</span>
              <span className="text-emerald-400 font-bold">GOTOWA NA PRAWDZIWE MODELE CV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
