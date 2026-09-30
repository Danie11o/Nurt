export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TimeStep = '12:00' | '12:15' | '12:30' | '12:45';

// 1. Obszary zalane
export interface FloodArea {
  id: string;
  name: string;
  timeStep: TimeStep;
  coordinates: [number, number][];
  depthAvgM: number;
  depthMaxM: number;
  currentVelocityMs: number;
  waterLevelDelta: string;
  areaHectares: number;
}

export interface FloodPolygon {
  timeStep: TimeStep;
  coordinates: [number, number][];
  waterLevelDelta: string;
}

export interface BlockedRoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  severity: 'BLOCKED' | 'THREATENED';
  timeStep: TimeStep;
}


// 2. Drogi i ich statusy
export type RoadStatus = 'PASSABLE' | 'THREATENED' | 'IMPASSABLE';

export interface RoadFeature {
  id: string;
  name: string;
  roadNumber: string;
  status: RoadStatus;
  coordinates: [number, number][];
  lengthKm: number;
  waterDepthCm?: number;
  description: string;
  recommendedDetour?: string;
  lastInspectionTime: string;
  firstAppearedStep?: TimeStep;
}


// 3. Budynki i ich statusy
export type BuildingStatus = 'SAFE' | 'THREATENED' | 'INSPECTION_PRIORITY';

export interface BuildingFeature {
  id: string;
  address: string;
  buildingType: 'Mieszkalny' | 'Użyteczności publicznej' | 'Gospodarczy' | 'Infrastruktura krytyczna';
  status: BuildingStatus;
  coordinates: [number, number];
  residentsReported: number;
  waterDistanceM: number; // odległość od wody lub poziom zalania
  hazardNotes: string;
  recommendedAction: string;
  droneVerified: boolean;
  firstAppearedStep?: TimeStep;
}

// 4. Punkty wykryte przez drona
export type DroneDetectionType = 'PERSON' | 'VEHICLE' | 'OBSTACLE' | 'INFRASTRUCTURE_DAMAGE';

export interface DroneDetectionPoint {
  id: string;
  type: DroneDetectionType;
  title: string;
  coordinates: [number, number];
  confidence: number; // np. 94.8%
  detectedAt: string;
  droneCallsign: string;
  sensor: string;
  description: string;
  recommendedAction: string;
  imageUrl: string;
  status: 'NOWY' | 'WERYFIKACJA' | 'ZADYSPONOWANO';
  firstAppearedStep?: TimeStep;
}

// 5. Raport różnicowy między kolejnymi przelotami drona (CHANGES SINCE LAST FLIGHT)
export interface FlightDiffReport {
  currentStep: TimeStep;
  previousStep: TimeStep | null;
  flightName: string;
  floodedAreaPercentChange: number; // np. +12 lub +77
  floodedAreaHectaresDiff: number; // np. +63.4 ha
  newBlockedRoadsCount: number; // np. 2
  newThreatenedBuildingsCount: number; // np. 7
  newCriticalAlertsCount: number; // np. 1
  newDetectionsCount: number; // np. 2
  highlights: string[];
  tacticalSummary: string;
}


// Alerty i Priorytety Operacyjne oceniane automatycznie przez silnik
export interface AlertIncident {
  id: string;
  title: string;
  location: string;
  locationName?: string; // alias
  severity: PriorityLevel;
  level: PriorityLevel; // alias dla zgodności
  priorityScore: number; // 0 - 100
  reason: string;
  evidence: string;
  recommendedAction: string;
  timestamp: string;
  detectedAt?: string; // alias
  coordinates: [number, number];
  description?: string; // alias dla zgodności
  status: 'PENDING' | 'DISPATCHED' | 'VERIFIED' | 'REJECTED';
  operatorDecision: 'PENDING' | 'APPROVED' | 'MODIFIED' | 'REJECTED' | 'DISPATCHED';
  uncertaintyMargin: string; // np. "±6% niepewności algorytmu"
  droneImage?: string;
  droneConfidence: number;
  timeStep: TimeStep;
  category: 'ROAD' | 'BUILDING' | 'INFRASTRUCTURE' | 'FLOOD_SURGE';
  whyThisMatters: string;
  changeSinceLastFlight: string;
  auxiliaryData: { label: string; value: string }[];
  assignedTeam?: string;
  isAcknowledged?: boolean;
}



// Etapy cyklu operacyjnego misji drona
export type MissionStage = 
  | 'REQUESTED' 
  | 'DISPATCHED' 
  | 'CAPTURED' 
  | 'UPLOAD' 
  | 'ANALYSIS' 
  | 'INTELLIGENCE_READY';

export interface DroneMission {
  id: string; // np. "MSN-2026-FL04"
  callsign: string;
  model: string;
  status: 'W LOCIE' | 'POWRÓT DO BAZY' | 'SKANOWANIE' | 'OCZEKIWANIE' | 'RE-TASKED / ZADANIOWANO';
  battery: number;
  altitude: number;
  speed: number;
  heading: number;
  coordinates: [number, number];
  missionName: string;
  targetSector: string;
  lastUpdateSecondsAgo: number;
  analyzedAreasCount: number;
  totalAreaSqKm: number;
  linkQuality: 'EXCELLENT' | 'GOOD' | 'FAIR';
  coveragePercent: number; // np. 84%
  missionProgressPercent: number; // np. 72%
  capturedFramesCount: number; // np. 1420
  lastDataUpload: string; // np. "14s temu (Starlink Direct)"
  currentStage: MissionStage;
  plannedAreaCoordinates: [number, number][]; // Zaplanowany poligon operacyjny
  flightPathCoordinates: [number, number][]; // Trasa lotu (lawnmower / siatka patrolowa)
}


// Źródła danych publicznych
export interface PublicDataSource {
  id: string;
  name: string;
  provider: string;
  status: string;
  detail: string;
  badge: string;
}

// Unia zaznaczonego elementu mapy do panelu szczegółów
export type MapSelectedItem =
  | { kind: 'ALERT'; data: AlertIncident }
  | { kind: 'ROAD'; data: RoadFeature }
  | { kind: 'BUILDING'; data: BuildingFeature }
  | { kind: 'DETECTION'; data: DroneDetectionPoint }
  | { kind: 'FLOOD'; data: FloodArea };

// Profil operacyjny: Cywilny (PSP) vs Dual-Use (WOT / Logistyka)
export type OperationalProfile = 'CIVIL' | 'DUAL_USE';

// Moduł Sił i Środków (SOP)
export interface OperationalResource {
  id: string;
  name: string;
  type: 'AMPHIBIOUS' | 'BOAT' | 'TEAM';
  total: number;
  available: number;
  inAction: number;
  badge: string;
}

// Cel zadaniowania drona (Re-task Target)
export interface RetaskTarget {
  alertId: string;
  coords: [number, number];
  title: string;
  timestamp: string;
}
