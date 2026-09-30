import { PriorityLevel, TimeStep, AlertIncident } from '../../types';

/**
 * STRUKTURY DANYCH RUROCIĄGU ANALITYCZNEGO RESQGRID
 * 
 * Rozdzielenie odpowiedzialności:
 * 1. Dane wejściowe z drona (RawDroneInput)
 * 2. Przetwarzanie wstępne (PreprocessedFrame)
 * 3. Detekcja obiektów i wody (DetectionResults)
 * 4. Geolokalizacja (GeolocatedEntities)
 * 5. Porównanie czasowe (TemporalComparison)
 * 6. Ocena ryzyka (RiskAssessment)
 * 7. Priorytety i alerty (OperationalAlertOutput)
 */

// Krok 1: Surowe dane z platformy dronowej
export interface RawDroneInput {
  missionId: string;
  frameId: string;
  timestamp: string;
  timeStep: TimeStep;
  gpsCoords: [number, number];
  altitudeM: number;
  pitchDeg: number;
  rollDeg: number;
  yawDeg: number;
  cameraFocalLengthMm: number;
  rgbImageUrl: string;
  thermalImageUrl?: string;
  groundSampleDistanceCm: number; // GSD np. 2.4 cm/px
}

// Krok 2: Znormalizowana klatka po wstępnym przetworzeniu
export interface PreprocessedFrame {
  frameId: string;
  processingTimeMs: number;
  radiometricCalibrated: boolean;
  orthoRectified: boolean;
  contrastEnhancedUrl: string;
  cloudShadowMaskApplied: boolean;
}

// Krok 3: Wyniki detekcji obiektowej i segmentacji wody
export interface DetectedBoundingBox {
  id: string;
  classLabel: 'PERSON' | 'VEHICLE' | 'OBSTACLE' | 'BREACH' | 'FLOOD_WATER';
  confidence: number; // 0 - 100%
  bbox2D: [number, number, number, number]; // [ymin, xmin, ymax, xmax] w pikselach
  attributes: Record<string, string | number | boolean>;
}

export interface DetectionResults {
  frameId: string;
  processingTimeMs: number;
  algorithmName: string; // np. "YOLOv8-Flood-Seg (Demo Simulation)"
  detectedObjects: DetectedBoundingBox[];
  waterSurfaceEstimatedSqM: number;
  waterCoverageRatio: number; // np. 0.42 (42% kadru pod wodą)
}

// Krok 4: Transformacja współrzędnych obrazu do siatki GIS (EPSG:4326)
export interface GeolocatedEntity {
  id: string;
  type: string;
  coordinates: [number, number];
  errorMarginM: number; // np. ±1.2m
  nearestRoadId?: string;
  nearestBuildingAddress?: string;
}

export interface GeolocatedResults {
  processingTimeMs: number;
  projectionSystem: string; // "EPSG:4326 (WGS84)"
  entities: GeolocatedEntity[];
  floodBoundaryPolygon: [number, number][];
}

// Krok 5: Porównanie z poprzednim przelotem drona
export interface TemporalComparison {
  processingTimeMs: number;
  currentStep: TimeStep;
  previousStep: TimeStep | null;
  deltaWaterLevelCm: number;
  deltaFloodedAreaSqM: number;
  waterProgressionRateMs: number;
  newCutoffEntitiesCount: number;
  changeSummary: string;
}

// Krok 6: Wycena ryzyka operacyjnego
export interface RiskAssessment {
  processingTimeMs: number;
  overallRiskScore: number; // 0 - 100
  severityCalculated: PriorityLevel;
  lifeThreatScore: number; // 0 - 40
  mobilityDisruptionScore: number; // 0 - 25
  infrastructureVulnerabilityScore: number; // 0 - 20
  sensorConfidenceScore: number; // 0 - 15
  reasonNarrative: string;
  recommendedAction: string;
}

// Krok 7: Wygenerowany alert operacyjny
export interface PipelineExecutionResult {
  step1Raw: RawDroneInput;
  step2Preprocessed: PreprocessedFrame;
  step3Detection: DetectionResults;
  step4Geolocated: GeolocatedResults;
  step5Comparison: TemporalComparison;
  step6Risk: RiskAssessment;
  step7Alert: AlertIncident;
  totalLatencyMs: number;
  executedAt: string;
}
