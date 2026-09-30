import { 
  RawDroneInput, 
  PreprocessedFrame, 
  DetectionResults, 
  GeolocatedResults, 
  TemporalComparison, 
  RiskAssessment, 
  PipelineExecutionResult 
} from './types';
import { TimeStep } from '../../types';
import { ALL_ALERTS, TACTICAL_IMAGE_FALLBACK } from '../../data/mockData';

/**
 * =========================================================================
 * MODUŁ ANALIZY DANYCH DRONOWYCH (DEMO / MOCK ANALYSIS PIPELINE)
 * =========================================================================
 * 
 * UWAGA HACKATHONOWA / TRANSPARENTNOŚĆ:
 * Poniższy kod modeluje architekturę produkcyjnego rurociągu analitycznego.
 * Na potrzeby demonstracji wyniki są deterministycznie symulowane na podstawie
 * realnego scenariusza powodziowego dorzecza Wisłoka (brak ciężkiego modelu PyTorch
 * na żywo, aby zagwarantować 100% stabilności i zerową awaryjność na scenie).
 * 
 * Rurociąg składa się z 7 kroków:
 * 1. Drone imagery (Odbiór surowej klatki z drona)
 * 2. Pre-processing (Kalibracja radiometryczna, korekcja perspektywy)
 * 3. Object / flood detection (Detekcja obiektowa i segmentacja wody)
 * 4. Geolocation (Rzutowanie pikseli na układ współrzędnych WGS84)
 * 5. Comparison with previous flight (Wykrywanie zmian delta-t)
 * 6. Risk assessment (Kalkulacja macierzy ryzyka i zagrożenia życia)
 * 7. Operational alerts (Generowanie karty dyspozytorskiej dla dowódcy)
 */

export class DemoAnalysisPipeline {
  /**
   * Krok 1: Odbiór surowych danych telemetrycznych i obrazowych z drona
   */
  public static step1_receiveDroneImagery(timeStep: TimeStep): RawDroneInput {
    return {
      missionId: 'MSN-2026-FL04',
      frameId: `FRM-${timeStep.replace(':', '')}-8842`,
      timestamp: `${timeStep}:12 CEST`,
      timeStep,
      gpsCoords: [50.0385, 21.9880],
      altitudeM: 125.4,
      pitchDeg: -45.0, // kąt nachylenia kamery
      rollDeg: 0.8,
      yawDeg: 42.1,
      cameraFocalLengthMm: 35.0,
      groundSampleDistanceCm: 2.8,
      rgbImageUrl: TACTICAL_IMAGE_FALLBACK,
      thermalImageUrl: TACTICAL_IMAGE_FALLBACK,
    };
  }

  /**
   * Krok 2: Przetwarzanie wstępne (Pre-processing)
   */
  public static step2_preprocess(raw: RawDroneInput): PreprocessedFrame {
    return {
      frameId: raw.frameId,
      processingTimeMs: 42,
      radiometricCalibrated: true,
      orthoRectified: true,
      contrastEnhancedUrl: raw.rgbImageUrl,
      cloudShadowMaskApplied: true,
    };
  }

  /**
   * Krok 3: Detekcja obiektów i segmentacja rozlewiska (Object & Flood Detection)
   */
  public static step3_detectObjectsAndFlood(preprocessed: PreprocessedFrame): DetectionResults {
    return {
      frameId: preprocessed.frameId,
      processingTimeMs: 118,
      algorithmName: 'YOLOv8-Flood-Seg (Demo Simulation Pipeline)',
      waterCoverageRatio: 0.68, // 68% kadru zalane wodą
      waterSurfaceEstimatedSqM: 14200,
      detectedObjects: [
        {
          id: 'DET-OBJ-01',
          classLabel: 'PERSON',
          confidence: 97.4,
          bbox2D: [120, 340, 210, 420],
          attributes: { location: 'Dach budynku mieszkalnego', thermalSignalC: 36.6, count: 2 },
        },
        {
          id: 'DET-OBJ-02',
          classLabel: 'VEHICLE',
          confidence: 94.2,
          bbox2D: [450, 680, 580, 890],
          attributes: { vehicleType: 'SUV', waterDepthCm: 75, isMoving: false },
        },
        {
          id: 'DET-OBJ-03',
          classLabel: 'BREACH',
          confidence: 96.1,
          bbox2D: [50, 80, 190, 260],
          attributes: { breachWidthM: 8, waterVelocityMs: 2.4 },
        },
      ],
    };
  }

  /**
   * Krok 4: Geolokalizacja i rzutowanie do układu GIS (Geolocation)
   */
  public static step4_geolocate(detections: DetectionResults, raw: RawDroneInput): GeolocatedResults {
    return {
      processingTimeMs: 28,
      projectionSystem: 'EPSG:4326 (WGS84) + BDOT10k Topo Grid',
      entities: [
        {
          id: 'GEO-01',
          type: 'PERSON',
          coordinates: [50.0478, 22.0084],
          errorMarginM: 1.2,
          nearestBuildingAddress: 'ul. Nadrzeczna 14A',
        },
        {
          id: 'GEO-02',
          type: 'VEHICLE',
          coordinates: [50.0388, 21.9885],
          errorMarginM: 0.8,
          nearestRoadId: 'DW-878 (km 14.8)',
        },
        {
          id: 'GEO-03',
          type: 'BREACH',
          coordinates: [50.0352, 21.9832],
          errorMarginM: 1.5,
          nearestRoadId: 'Wał polderowy sektor południowy',
        },
      ],
      floodBoundaryPolygon: [
        [50.0360, 21.9810],
        [50.0395, 21.9860],
        [50.0420, 21.9920],
        [50.0460, 21.9980],
        [50.0415, 22.0060],
        [50.0360, 21.9810],
      ],
    };
  }

  /**
   * Krok 5: Porównanie czasowe z poprzednim nalotem (Comparison with previous flight)
   */
  public static step5_compareTemporal(timeStep: TimeStep): TemporalComparison {
    if (timeStep === '12:00') {
      return {
        processingTimeMs: 14,
        currentStep: '12:00',
        previousStep: null,
        deltaWaterLevelCm: 0,
        deltaFloodedAreaSqM: 0,
        waterProgressionRateMs: 0.05,
        newCutoffEntitiesCount: 0,
        changeSummary: 'Nalot bazowy (T-0). Woda w korycie głównym, brak zalania dróg.',
      };
    }

    if (timeStep === '12:15') {
      return {
        processingTimeMs: 19,
        currentStep: '12:15',
        previousStep: '12:00',
        deltaWaterLevelCm: 14,
        deltaFloodedAreaSqM: 335000,
        waterProgressionRateMs: 0.45,
        newCutoffEntitiesCount: 2,
        changeSummary: '+69% rozlewisk. Zalanie dojazdu do osiedla (ul. Nadrzeczna).',
      };
    }

    if (timeStep === '12:30') {
      return {
        processingTimeMs: 22,
        currentStep: '12:30',
        previousStep: '12:15',
        deltaWaterLevelCm: 22,
        deltaFloodedAreaSqM: 634000,
        waterProgressionRateMs: 0.85,
        newCutoffEntitiesCount: 7,
        changeSummary: '+77% rozlewisk. Wylanie na trasę DW-878, uwięziony pojazd i osoby na dachu.',
      };
    }

    // 12:45
    return {
      processingTimeMs: 16,
      currentStep: '12:45',
      previousStep: '12:30',
      deltaWaterLevelCm: -3,
      deltaFloodedAreaSqM: -33000,
      waterProgressionRateMs: -0.05,
      newCutoffEntitiesCount: 0,
      changeSummary: '-2.3% spadek. Stabilizacja lustra wody po interwencji służb.',
    };
  }

  /**
   * Krok 6: Ocena ryzyka operacyjnego (Risk assessment)
   */
  public static step6_assessRisk(timeStep: TimeStep, comparison: TemporalComparison): RiskAssessment {
    const isCritical = timeStep === '12:30';
    return {
      processingTimeMs: 34,
      overallRiskScore: isCritical ? 96 : timeStep === '12:15' ? 88 : timeStep === '12:45' ? 72 : 56,
      severityCalculated: isCritical ? 'CRITICAL' : 'HIGH',
      lifeThreatScore: isCritical ? 40 : 28,
      mobilityDisruptionScore: isCritical ? 24 : 18,
      infrastructureVulnerabilityScore: 18,
      sensorConfidenceScore: 14,
      reasonNarrative: isCritical
        ? 'Jedyna droga dojazdowa DW-878 zalana w 70%, zablokowany ruch kołowy, bezpośrednie zagrożenie życia mieszkańców na dachu.'
        : 'Wzrost poziomu wody zagraża infrastrukturze i zabudowaniom nadrzecznym.',
      recommendedAction: isCritical
        ? 'Skierować amfibię PTS-M (3. PBOT WOT) oraz łodzie OSP do natychmiastowej ewakuacji. Blokada trasy przez KPP.'
        : 'Weryfikacja umocnień wałowych i przygotowanie zespołów ewakuacyjnych.',
    };
  }

  /**
   * Krok 7: Złożenie całości w gotowy wynik i alert operacyjny (Operational alerts)
   */
  public static runPipeline(timeStep: TimeStep): PipelineExecutionResult {
    const start = performance.now();

    const step1Raw = this.step1_receiveDroneImagery(timeStep);
    const step2Preprocessed = this.step2_preprocess(step1Raw);
    const step3Detection = this.step3_detectObjectsAndFlood(step2Preprocessed);
    const step4Geolocated = this.step4_geolocate(step3Detection, step1Raw);
    const step5Comparison = this.step5_compareTemporal(timeStep);
    const step6Risk = this.step6_assessRisk(timeStep, step5Comparison);

    // Krok 7: Wybór właściwego alertu ze scenariusza
    const step7Alert = ALL_ALERTS.find(a => a.timeStep === timeStep) || ALL_ALERTS[0];

    const totalLatencyMs = Math.round(
      step2Preprocessed.processingTimeMs +
      step3Detection.processingTimeMs +
      step4Geolocated.processingTimeMs +
      step5Comparison.processingTimeMs +
      step6Risk.processingTimeMs
    );

    return {
      step1Raw,
      step2Preprocessed,
      step3Detection,
      step4Geolocated,
      step5Comparison,
      step6Risk,
      step7Alert,
      totalLatencyMs,
      executedAt: `${timeStep}:38 CEST`,
    };
  }
}
