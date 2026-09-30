import { PriorityLevel, AlertIncident, TimeStep } from '../types';

/**
 * SILNIK AUTOMATYCZNEJ PRIORYTETYZACJI OPERACYJNEJ RESQGRID
 * 
 * Zasada działania:
 * System wylicza priorityScore (0-100) na podstawie fuzji danych:
 * - Zagrożenie życia ludzkiego (waga: 40%)
 * - Dynamika przyrostu wód i odcięcie szlaków (waga: 25%)
 * - Wrażliwość infrastruktury krytycznej (waga: 20%)
 * - Wiarygodność i świeżość detekcji drona (waga: 15%)
 * 
 * Filozofia ratownicza:
 * "System generuje rekomendację wspierającą, a ostateczną decyzję podejmuje dowódca (Human-in-the-Loop)."
 */

export interface EventAssessmentInput {
  id: string;
  title: string;
  location: string;
  category: 'ROAD' | 'BUILDING' | 'INFRASTRUCTURE' | 'FLOOD_SURGE';
  coordinates: [number, number];
  lifeThreatLevel: 'IMMINENT' | 'POTENTIAL' | 'NONE'; // bezpośrednie / potencjalne / brak
  roadCutoffPercentage: number; // np. 70 (%)
  waterRiseRateCmPerHour: number; // np. 22 (cm/h)
  infrastructureRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  sensorConfidence: number; // np. 96 (%)
  droneImage?: string;
  timeStep: TimeStep;
  timestamp: string;
}

export class PrioritizationEngine {
  /**
   * Ocenia zdarzenie terenowe i zwraca pełny priorytet operacyjny
   */
  public static evaluateEvent(input: EventAssessmentInput): AlertIncident {
    // 1. Składowa: Zagrożenie życia (max 40 pkt)
    let lifeScore = 0;
    if (input.lifeThreatLevel === 'IMMINENT') lifeScore = 40;
    else if (input.lifeThreatLevel === 'POTENTIAL') lifeScore = 24;
    else lifeScore = 8;

    // 2. Składowa: Dynamika i odcięcie szlaków (max 25 pkt)
    const cutoffScore = Math.min(15, (input.roadCutoffPercentage / 100) * 15);
    const waterScore = Math.min(10, (input.waterRiseRateCmPerHour / 25) * 10);
    const mobilityScore = cutoffScore + waterScore;

    // 3. Składowa: Infrastruktura krytyczna (max 20 pkt)
    let infraScore = 5;
    if (input.infrastructureRisk === 'HIGH') infraScore = 20;
    else if (input.infrastructureRisk === 'MEDIUM') infraScore = 12;

    // 4. Składowa: Jakość danych z drona (max 15 pkt)
    const sensorScore = Math.min(15, (input.sensorConfidence / 100) * 15);

    // Sumaryczny wynik (0 - 100)
    const rawScore = Math.round(lifeScore + mobilityScore + infraScore + sensorScore);
    const priorityScore = Math.min(100, Math.max(0, rawScore));

    // Kwalifikacja severity
    let severity: PriorityLevel = 'LOW';
    if (priorityScore >= 85) severity = 'CRITICAL';
    else if (priorityScore >= 70) severity = 'HIGH';
    else if (priorityScore >= 45) severity = 'MEDIUM';

    // Generowanie uzasadnienia (Reason)
    let reason = '';
    if (input.roadCutoffPercentage >= 50 && input.lifeThreatLevel === 'IMMINENT') {
      reason = `Jedyna dostępna droga dojazdowa została zalana w ${input.roadCutoffPercentage}%, a poziom wody wzrasta w tempie +${input.waterRiseRateCmPerHour} cm/h. Dron wykrył bezpośrednie zagrożenie dla uwięzionych osób.`;
    } else if (input.roadCutoffPercentage >= 50) {
      reason = `Szlak komunikacyjny zalany w ${input.roadCutoffPercentage}%, zablokowany ruch kołowy. Woda wzrasta w tempie +${input.waterRiseRateCmPerHour} cm/h od poprzedniego przelotu.`;
    } else if (input.infrastructureRisk === 'HIGH') {
      reason = `Napór hydrodynamiczny i zator nadrzeczny grozi bezpośrednim podmyciem lub wyłączeniem obiektu o znaczeniu strategicznym.`;
    } else {
      reason = `Wzrost poziomu zalania polderu (+${input.waterRiseRateCmPerHour} cm/h). Lustro wody zbliża się do progów technicznych obiektu.`;
    }

    // Zebrany materiał dowodowy (Evidence)
    const evidence = `Sensor: Dron BIELIK-1 (Kamera FLIR IR / Zoom 30x, AI Conf: ${input.sensorConfidence}%) • IMGW Hydro: +${input.waterRiseRateCmPerHour} cm/h • BDOT10k: Analiza profilu wysokościowego terenu`;

    // Rekomendacja operacyjna
    let recommendedAction = '';
    if (severity === 'CRITICAL') {
      recommendedAction = `Skierować amfibię PTS-M (3. PBOT WOT) lub łodzie motorowe OSP do sektora i rozpocząć natychmiastową ewakuację. KPP: blokada wjazdu na węźle.`;
    } else if (severity === 'HIGH') {
      recommendedAction = `Zadysponować ciężki sprzęt inżynieryjny PSP z chwytakiem do udrożnienia koryta oraz wprowadzić zakaz wjazdu dla pojazdów >3.5t.`;
    } else {
      recommendedAction = `PGE Dystrybucja: monitoring podstacji. Skierować patrol WOT z workami z piaskiem celem prewencyjnego podwyższenia wału.`;
    }

    // Margines niepewności
    const uncertaintyMargin = `±${Math.round((100 - input.sensorConfidence) * 0.8 + 3)}% (wymaga zatwierdzenia przez dowódcę sztabu)`;

    return {
      id: input.id,
      title: input.title,
      location: input.location,
      locationName: input.location,
      severity,
      level: severity,
      priorityScore,
      reason,
      evidence,
      recommendedAction,
      timestamp: input.timestamp,
      detectedAt: input.timestamp,
      coordinates: input.coordinates,
      description: reason,
      status: 'PENDING',
      operatorDecision: 'PENDING',
      uncertaintyMargin,
      droneConfidence: input.sensorConfidence,
      droneImage: input.droneImage,
      timeStep: input.timeStep,
      category: input.category,
      whyThisMatters: `Zdarzenie wpływa bezpośrednio na bezpieczeństwo sektora ${input.location}. Odcięcie szlaków lub infrastruktury może uniemożliwić dalsze działania ratownicze.`,
      changeSinceLastFlight: `Od poprzedniego przelotu wskaźnik zagrożenia wzrósł o +${input.waterRiseRateCmPerHour} cm/h, a stopień zalania wynosi obecnie ${input.roadCutoffPercentage}%.`,
      auxiliaryData: [
        { label: 'Poziom odcięcia', value: `${input.roadCutoffPercentage}%` },
        { label: 'Dynamika przyrostu', value: `+${input.waterRiseRateCmPerHour} cm/h` },
        { label: 'Wiarygodność drona', value: `${input.sensorConfidence}%` },
      ],
      isAcknowledged: false,
    };
  }
}
