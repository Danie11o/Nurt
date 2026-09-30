import { AlertIncident, DroneMission, PublicDataSource, FloodPolygon, BlockedRoadSegment, TimeStep } from '../types';

export const TACTICAL_IMAGE_FALLBACK = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%20width%3D%22800%22%20height%3D%22450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23080e18%22%2F%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2240%22%20height%3D%2240%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2040%200%20L%200%200%200%2040%22%20fill%3D%22none%22%20stroke%3D%22%231e293b%22%20stroke-width%3D%220.8%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22url(%23grid)%22%2F%3E%3Cpath%20d%3D%22M150%20320%20Q%20350%20220%20500%20280%20T%20750%20240%20L%20800%20450%20L%20100%20450%20Z%22%20fill%3D%22%230284c7%22%20opacity%3D%220.35%22%2F%3E%3Cpath%20d%3D%22M0%20225%20H800%20M400%200%20V450%22%20stroke%3D%22%2338bdf8%22%20stroke-width%3D%221%22%20stroke-dasharray%3D%226%206%22%20opacity%3D%220.4%22%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22225%22%20r%3D%2290%22%20fill%3D%22none%22%20stroke%3D%22%230ea5e9%22%20stroke-width%3D%221.5%22%20stroke-dasharray%3D%228%206%22%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22225%22%20r%3D%226%22%20fill%3D%22%2338bdf8%22%2F%3E%3Crect%20x%3D%22300%22%20y%3D%22165%22%20width%3D%22200%22%20height%3D%22120%22%20fill%3D%22none%22%20stroke%3D%22%23f43f5e%22%20stroke-width%3D%221.8%22%20stroke-dasharray%3D%224%202%22%2F%3E%3Ctext%20x%3D%22305%22%20y%3D%22160%22%20font-family%3D%22monospace%22%20font-size%3D%2211%22%20fill%3D%22%23fb7185%22%20font-weight%3D%22bold%22%3EDETEKCJA%20AI%3A%20SEKTOR%20ZAGRO%C5%BBENIA%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22425%22%20font-family%3D%22monospace%22%20font-size%3D%2213%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%222%22%3ESYMULOWANA%20KLATKA%20SENSORA%20%E2%80%A2%20TRYB%20DEMO%3C%2Ftext%3E%3C%2Fsvg%3E";

export const PLANNED_FLIGHT_AREA: [number, number][] = [
  [50.0270, 22.0000],
  [50.0360, 22.0110],
  [50.0440, 22.0175],
  [50.0520, 22.0110],
  [50.0570, 22.0180],
  [50.0520, 22.0250],
  [50.0420, 22.0275],
  [50.0330, 22.0170],
];

export const FLIGHT_PATH_WAYPOINTS: [number, number][] = [
  [50.0270, 22.0032],
  [50.0317, 22.0071], // 12:00
  [50.0354, 22.0136],
  [50.0406, 22.0165], // 12:15
  [50.0436, 22.0208],
  [50.0458, 22.0200], // 12:30
  [50.0480, 22.0135],
  [50.0490, 22.0122], // 12:45 / podejście DW-878
  [50.0515, 22.0167],
  [50.0550, 22.0188],
];

export const INITIAL_DRONE_MISSION: DroneMission = {
  id: 'MSN-2026-FL04',
  callsign: 'UAV-01',
  model: 'Platforma obserwacyjna RGB / termowizja',
  status: 'W LOCIE',
  battery: 98,
  altitude: 125, // metry AGL
  speed: 38, // km/h
  heading: 42, // stopnie
  coordinates: [50.0317, 22.0071],
  missionName: 'MISJA #FL-04: Rozpoznanie Dorzecza Wisłoka',
  targetSector: 'SEKTOR B-2 (Nadrzecze)',
  lastUpdateSecondsAgo: 14,
  analyzedAreasCount: 4,
  totalAreaSqKm: 42.6,
  linkQuality: 'EXCELLENT',
  coveragePercent: 25,
  missionProgressPercent: 28,
  capturedFramesCount: 380,
  lastDataUpload: '20 s temu (pakiet demo)',
  currentStage: 'DISPATCHED',
  plannedAreaCoordinates: PLANNED_FLIGHT_AREA,
  flightPathCoordinates: FLIGHT_PATH_WAYPOINTS,
};

export const INITIAL_RESOURCES: import('../types').OperationalResource[] = [
  {
    id: 'res-ptsm',
    name: 'Pojazdy terenowe',
    type: 'AMPHIBIOUS',
    total: 2,
    available: 1,
    inAction: 1,
    badge: 'SŁUŻBY / PARTNER',
  },
  {
    id: 'res-boat',
    name: 'Łodzie ratownicze',
    type: 'BOAT',
    total: 4,
    available: 3,
    inAction: 1,
    badge: 'PSP / OSP',
  },
  {
    id: 'res-team',
    name: 'Zespoły PSP / OSP',
    type: 'TEAM',
    total: 6,
    available: 5,
    inAction: 1,
    badge: 'KSRG',
  },
];

export const PUBLIC_DATA_SOURCES: PublicDataSource[] = [
  {
    id: 'gugik-orto',
    name: 'GUGiK Geoportal',
    provider: 'Główny Urząd Geodezji i Kartografii',
    status: 'PLAN PILOTAŻU',
    detail: 'Ortofotomapa, BDOT10k i NMT jako kontekst',
    badge: 'BDOT10k',
  },
  {
    id: 'imgw-hydro',
    name: 'IMGW-PIB Hydro',
    provider: 'Instytut Meteorologii i Gosp. Wodnej',
    status: 'PLAN PILOTAŻU',
    detail: 'Dane hydrologiczne jako kontekst; brak live API w demo',
    badge: 'ALARM',
  },
  {
    id: 'copernicus-ems',
    name: 'Copernicus EMS',
    provider: 'Komisja Europejska / ESA Rapid Mapping',
    status: 'PLAN PILOTAŻU',
    detail: 'Obrazowanie satelitarne jako kontekst obszarowy',
    badge: 'SAR-C',
  },
  {
    id: 'prg-addresses',
    name: 'PRG Ulice i Adresy',
    provider: 'GUGiK PRG',
    status: 'PLAN PILOTAŻU',
    detail: 'Adresy i obiekty wrażliwe po sprawdzeniu warunków użycia',
    badge: 'PRG API',
  },
];

export const TIMESTEP_DATA: Record<TimeStep, {
  droneCoords: [number, number];
  battery: number;
  missionStatus: 'W LOCIE' | 'POWRÓT DO BAZY' | 'SKANOWANIE' | 'OCZEKIWANIE';
  waterLevelDelta: string;
  summary: string;
  coveragePercent: number;
  missionProgressPercent: number;
  capturedFramesCount: number;
  lastDataUpload: string;
  currentStage: 'REQUESTED' | 'DISPATCHED' | 'CAPTURED' | 'UPLOAD' | 'ANALYSIS' | 'INTELLIGENCE_READY';
}> = {
  '12:00': {
    droneCoords: [50.0317, 22.0071],
    battery: 98,
    missionStatus: 'W LOCIE',
    waterLevelDelta: '+5 cm/h',
    summary: 'Rozpoczęcie lotu patrolowego. Rzeka zbliża się do korony wałów.',
    coveragePercent: 25,
    missionProgressPercent: 28,
    capturedFramesCount: 380,
    lastDataUpload: '20 s temu (pakiet demo)',
    currentStage: 'DISPATCHED',
  },
  '12:15': {
    droneCoords: [50.0406, 22.0165],
    battery: 89,
    missionStatus: 'SKANOWANIE',
    waterLevelDelta: '+14 cm/h',
    summary: 'Wykryto przesiąki wału przeciwpowodziowego w sektorze południowym.',
    coveragePercent: 54,
    missionProgressPercent: 58,
    capturedFramesCount: 840,
    lastDataUpload: '12 s temu (pakiet demo)',
    currentStage: 'CAPTURED',
  },
  '12:30': {
    droneCoords: [50.0458, 22.0200],
    battery: 81,
    missionStatus: 'SKANOWANIE',
    waterLevelDelta: '+22 cm/h (KULMINACJA)',
    summary: 'Gwałtowny rozlew. Zalana droga wojewódzka i odcięcie zabudowań.',
    coveragePercent: 82,
    missionProgressPercent: 78,
    capturedFramesCount: 1420,
    lastDataUpload: '14 s temu (pakiet demo)',
    currentStage: 'ANALYSIS',
  },
  '12:45': {
    droneCoords: [50.0490, 22.0122],
    battery: 73,
    missionStatus: 'SKANOWANIE',
    waterLevelDelta: '+18 cm/h (STABILIZACJA)',
    summary: 'Przelot weryfikacyjny. Wyznaczenie alternatywnych korytarzy ewakuacji.',
    coveragePercent: 96,
    missionProgressPercent: 95,
    capturedFramesCount: 1890,
    lastDataUpload: '6 s temu (LOT-02)',
    currentStage: 'INTELLIGENCE_READY',
  },
};


export const ALL_ALERTS: AlertIncident[] = [
  {
    id: 'ALT-01',
    severity: 'CRITICAL',
    level: 'CRITICAL',
    priorityScore: 96,
    title: 'Dojazd do Mostu Załęskiego (DW-878) odcięty przez wodę',
    location: 'DW-878 — zachodni dojazd do Mostu Załęskiego',
    locationName: 'DW-878 — zachodni dojazd do Mostu Załęskiego',
    coordinates: [50.0490, 22.0122],
    reason: 'Zachodni dojazd do Mostu Załęskiego został zalany w 70%, a poziom wody wzrósł o +22 cm od poprzedniego przelotu. Przepływ przez jezdnię stwarza ryzyko utraty przyczepności i podmycia pobocza.',
    whyThisMatters: 'DW-878 jest jednym z kluczowych korytarzy logistycznych w tym scenariuszu. Zalanie dojazdu do przeprawy wymusza skierowanie pojazdów na inną, wcześniej zweryfikowaną trasę.',
    changeSinceLastFlight: 'Stopień zalania jezdni wzrósł z 25% (o godz. 12:15) do 70% (o 12:30). Głębokość nurtu wzrosła z 15 cm do 75 cm (+60 cm w 15 minut).',
    evidence: 'UAV-01, LOT-01 (syntetyczny materiał RGB): zalany odcinek drogi • warstwa dróg: brak krótkiego objazdu • wartości demonstracyjne wymagają weryfikacji operatora',
    auxiliaryData: [
      { label: 'Głębokość szacunkowa', value: '75 cm (nurt porywisty)' },
      { label: 'Długość zalanego odcinka', value: '380 metrów' },
      { label: 'Prędkość nurtu Wisłoka', value: '2.4 m/s (ryzyko zmycia)' },
      { label: 'Objazd alternatywny', value: 'Trasa S19 (węzeł Jasionka)' },
    ],
    recommendedAction: 'Skierować zespół ratowniczy do sektora B-4 i rozpocząć ocenę potrzeby ewakuacji. KPP: natychmiastowa blokada na węźle.',
    uncertaintyMargin: '±4% (wysoka zgodność fuzji sensorów)',
    status: 'PENDING',
    operatorDecision: 'PENDING',
    isAcknowledged: false,
    droneConfidence: 96.4,
    timestamp: '12:28:40 CEST',
    detectedAt: '12:28:40',
    timeStep: '12:30',
    category: 'ROAD',
    droneImage: TACTICAL_IMAGE_FALLBACK,
  },
  {
    id: 'ALT-02',
    severity: 'HIGH',
    level: 'HIGH',
    priorityScore: 88,
    title: 'Ryzyko odcięcia osiedla i uwięzienia mieszkańców',
    location: 'Osiedle Słoneczne / ul. Nadrzeczna (14 posesji)',
    locationName: 'Osiedle Słoneczne / ul. Nadrzeczna (14 posesji)',
    coordinates: [50.0459, 22.0247],
    reason: 'Woda odcięła mostek dojazdowy. Operator oznaczył zabudowę wymagającą pilnej weryfikacji; demo nie identyfikuje osób.',
    whyThisMatters: 'Obszar obejmuje 14 budynków i ok. 45 mieszkańców. Jedyna droga dojazdowa (ul. Nadrzeczna) jest obecnie częściowo zalana i sytuacja pogarsza się. Woda wdarła się do parterów budynków.',
    changeSinceLastFlight: 'O godz. 12:15 woda znajdowała się 15m od zabudowań; o 12:30 wdarła się do budynków, a dron zarejestrował 8 osób na dachach sygnalizujących potrzebę pomocy.',
    evidence: 'UAV-01, LOT-01: obserwacja operatora • syntetyczna warstwa zabudowy: 14 budynków • status wymaga potwierdzenia w terenie lub LOT-02',
    auxiliaryData: [
      { label: 'Odcięte gospodarstwa', value: '14 budynków (ul. Nadrzeczna)' },
      { label: 'Wykryte osoby na dachach', value: '8 osób (w tym 2 dzieci)' },
      { label: 'Zalecany środek transportu', value: 'Amfibia PTS-M / Łodzie OSP' },
      { label: 'Punkt zborny', value: 'Szkoła Podstawowa (ul. Wzgórze)' },
    ],
    recommendedAction: 'Dyżurny ocenia potrzebę skierowania łodzi OSP/PSP i zleca LOT-02 nad drogą dojazdową. System nie wysyła dyspozycji samodzielnie.',
    uncertaintyMargin: '±6% (rekomendacja wspierająca dowódcę)',
    status: 'PENDING',
    operatorDecision: 'PENDING',
    isAcknowledged: false,
    droneConfidence: 93.8,
    timestamp: '12:24:12 CEST',
    detectedAt: '12:24:12',
    timeStep: '12:15',
    category: 'BUILDING',
    droneImage: TACTICAL_IMAGE_FALLBACK,
  },
  {
    id: 'ALT-03',
    severity: 'HIGH',
    level: 'HIGH',
    priorityScore: 78,
    title: 'Możliwe uszkodzenie mostu przez zator nadrzeczny',
    location: 'Most Drogowy na rzece Wisłok (Przęsło Środkowe)',
    locationName: 'Most Drogowy na rzece Wisłok (Przęsło Środkowe)',
    coordinates: [50.0389, 22.0153],
    reason: 'Masywny zator z połamanych drzew i pni oparty o filar mostu. Zwiększone parcie hydrodynamiczne wywołuje spiętrzenie wody o 80 cm.',
    whyThisMatters: 'Most DP-1382R to jedyna przeprawa rzeczna w promieniu 8 km. Pęknięcie wspornika i dalsze napieranie zatoru grozi katastrofą budowlaną i odcięciem wschodniego brzegu rzeki.',
    changeSinceLastFlight: 'Zator powiększył się o ok. 15 m³ pni drzew w ciągu ostatnich 15 minut. Różnica poziomów wody przed i za mostem wzrosła z 30 cm do 80 cm.',
    evidence: 'UAV-01, LOT-01: obserwacja zatoru przy filarze • rozmiar jest szacunkiem scenariusza i wymaga oceny specjalisty',
    auxiliaryData: [
      { label: 'Objętość rumoszu', value: '35 m³ drewna i konarów' },
      { label: 'Spiętrzenie wody', value: '+80 cm względem odpływu' },
      { label: 'Ruch kołowy', value: 'Zalecane zamknięcie >3.5t' },
      { label: 'Zadysponowany sprzęt', value: 'Dźwig z chwytakiem PSP' },
    ],
    recommendedAction: 'Zamknięcie mostu dla pojazdów >3.5t. Skierowanie grupy inżynieryjnej lub dźwigu PSP z chwytakiem hydraulicznym.',
    uncertaintyMargin: '±8% (wymaga inspekcji inżyniera budowlanego)',
    status: 'PENDING',
    operatorDecision: 'PENDING',
    isAcknowledged: false,
    droneConfidence: 89.2,
    timestamp: '12:26:05 CEST',
    detectedAt: '12:26:05',
    timeStep: '12:30',
    category: 'INFRASTRUCTURE',
    droneImage: TACTICAL_IMAGE_FALLBACK,
  },
  {
    id: 'ALT-04',
    severity: 'MEDIUM',
    level: 'MEDIUM',
    priorityScore: 56,
    title: 'Wzrost poziomu zalania strefy polderowej przy stacji GPZ',
    location: 'Polder zalewowy północno-wschodni / GPZ Trafo',
    locationName: 'Polder zalewowy północno-wschodni / GPZ Trafo',
    coordinates: [50.0520, 22.0190],
    reason: 'Rozlewisko powiększa się w tempie +18 m²/min. Lustro wody znajduje się 45 cm poniżej poziomu posadowienia rozdzielni elektroenergetycznej GPZ.',
    whyThisMatters: 'Stacja GPZ zaopatruje w energię elektryczną 15 000 odbiorców, w tym szpital miejski i przepompownie ścieków. Zalanie transformatorów spowoduje blackout w całym sektorze kryzysowym.',
    changeSinceLastFlight: 'Margines bezpieczeństwa skurczył się z 90m do 12m od ogrodzenia rozdzielni. Woda przyrasta w tempie +18 m²/min.',
    evidence: 'UAV-01, LOT-01: obserwacja odległości w scenariuszu • Copernicus pozostaje planowanym źródłem kontekstowym',
    auxiliaryData: [
      { label: 'Zasilana ludność', value: '15 000 mieszkańców' },
      { label: 'Zapas wysokościowy', value: '45 cm do cokołu trafo' },
      { label: 'Zapotrzebowanie na wał', value: '80m / 3 000 worków' },
      { label: 'Podmiot odpowiedzialny', value: 'Operator infrastruktury + sztab' },
    ],
    recommendedAction: 'Powiadomić operatora infrastruktury i zlecić ponowną obserwację granicy wody. Dalsze działanie zatwierdza dyżurny.',
    uncertaintyMargin: '±9% (prognoza modelu polderowego)',
    status: 'PENDING',
    operatorDecision: 'PENDING',
    isAcknowledged: false,
    droneConfidence: 91.5,
    timestamp: '12:12:30 CEST',
    detectedAt: '12:12:30',
    timeStep: '12:00',
    category: 'FLOOD_SURGE',
    droneImage: TACTICAL_IMAGE_FALLBACK,
  },
];


// Poligony zalania dla poszczególnych kroków czasowych
export const FLOOD_POLYGONS: Record<TimeStep, [number, number][]> = {
  '12:00': [
    [50.0260, 21.9720],
    [50.0320, 21.9800],
    [50.0380, 21.9880],
    [50.0440, 21.9960],
    [50.0480, 22.0050],
    [50.0460, 22.0080],
    [50.0410, 21.9990],
    [50.0350, 21.9890],
    [50.0290, 21.9800],
    [50.0240, 21.9750],
  ],
  '12:15': [
    [50.0240, 21.9680],
    [50.0320, 21.9770],
    [50.0370, 21.9840],
    [50.0450, 21.9930],
    [50.0510, 22.0080],
    [50.0500, 22.0160],
    [50.0440, 22.0120],
    [50.0390, 22.0020],
    [50.0310, 21.9890],
    [50.0230, 21.9760],
  ],
  '12:30': [
    // Kulminacja - wylanie na drogę DW-878 i podejście pod budynki
    [50.0220, 21.9640],
    [50.0300, 21.9730],
    [50.0360, 21.9810],
    [50.0395, 21.9860], // wylew na drogę
    [50.0420, 21.9920],
    [50.0460, 21.9980],
    [50.0540, 22.0120],
    [50.0535, 22.0240], // podejście pod GPZ
    [50.0490, 22.0220],
    [50.0465, 22.0110], // otoczenie budynków
    [50.0415, 22.0060],
    [50.0370, 21.9980],
    [50.0290, 21.9850],
    [50.0210, 21.9710],
  ],
  '12:45': [
    [50.0210, 21.9630],
    [50.0310, 21.9740],
    [50.0370, 21.9830],
    [50.0400, 21.9870],
    [50.0430, 21.9930],
    [50.0470, 22.0000],
    [50.0550, 22.0150],
    [50.0540, 22.0260],
    [50.0485, 22.0230],
    [50.0460, 22.0120],
    [50.0410, 22.0050],
    [50.0360, 21.9960],
    [50.0280, 21.9830],
    [50.0200, 21.9690],
  ],
};

// Zablokowane odcinki dróg
export const BLOCKED_ROADS: BlockedRoadSegment[] = [
  {
    id: 'ROAD-DW878',
    name: 'DW-878 — dojazd do Mostu Załęskiego',
    coordinates: [
      [50.04915, 22.01081],
      [50.04902, 22.01190],
      [50.04897, 22.01249],
    ],
    severity: 'BLOCKED',
    timeStep: '12:30',
  },
  {
    id: 'ROAD-NADRZECZNA',
    name: 'Ul. Nadrzeczna / Dojazd do osiedla',
    coordinates: [
      [50.0448, 22.0238],
      [50.0459, 22.0247],
    ],
    severity: 'BLOCKED',
    timeStep: '12:15',
  },
];
