import { 
  RoadFeature, 
  BuildingFeature, 
  DroneDetectionPoint, 
  FloodArea, 
  TimeStep,
  FlightDiffReport
} from '../types';

/**
 * DETERMINISTYCZNY SCENARIUSZ DEMONSTRACYJNY (DOLINA WISŁOKA / PODKARPACIE)
 * Każdy krok czasowy (12:00, 12:15, 12:30, 12:45) to osobny etap syntetycznego scenariusza UAV-01.
 */

// 1. OBSZARY ZALANE (Poligony)
export const SITUATIONAL_FLOOD_AREAS: Record<TimeStep, FloodArea[]> = {
  '12:00': [
    {
      id: 'FLOOD-A1',
      name: 'Koryto główne Wisłoka i bezpośrednie poldery',
      timeStep: '12:00',
      coordinates: [
        [50.0265, 22.0015], [50.0317, 22.0055], [50.0354, 22.0122],
        [50.0406, 22.0150], [50.0436, 22.0192], [50.0458, 22.0185],
        [50.0480, 22.0120], [50.0496, 22.0117], [50.0520, 22.0152],
        [50.0550, 22.0172], [50.0550, 22.0204], [50.0520, 22.0208],
        [50.0496, 22.0148], [50.0480, 22.0152], [50.0458, 22.0215],
        [50.0436, 22.0225], [50.0406, 22.0180], [50.0354, 22.0155],
        [50.0317, 22.0087], [50.0265, 22.0045],
      ],
      depthAvgM: 1.8,
      depthMaxM: 3.2,
      currentVelocityMs: 1.2,
      waterLevelDelta: '+5 cm/h',
      areaHectares: 48.5,
    },
  ],
  '12:15': [
    {
      id: 'FLOOD-A1',
      name: 'Rozlewisko nadrzeczne (przerwanie wału lokalnego)',
      timeStep: '12:15',
      coordinates: [
        [50.0260, 22.0005], [50.0320, 22.0048], [50.0355, 22.0112],
        [50.0408, 22.0140], [50.0438, 22.0180], [50.0460, 22.0172],
        [50.0482, 22.0108], [50.0500, 22.0105], [50.0530, 22.0142],
        [50.0555, 22.0162], [50.0555, 22.0215], [50.0525, 22.0220],
        [50.0498, 22.0160], [50.0480, 22.0165], [50.0460, 22.0230],
        [50.0430, 22.0245], [50.0400, 22.0195], [50.0350, 22.0170],
        [50.0310, 22.0098], [50.0260, 22.0055],
      ],
      depthAvgM: 2.2,
      depthMaxM: 3.9,
      currentVelocityMs: 1.7,
      waterLevelDelta: '+14 cm/h',
      areaHectares: 82.0,
    },
  ],
  '12:30': [
    {
      id: 'FLOOD-A1',
      name: 'FALA KULMINACYJNA — Zalanie trasy DW-878 i osiedla nadrzecznego',
      timeStep: '12:30',
      coordinates: [
        [50.0260, 21.9995], [50.0320, 22.0040], [50.0355, 22.0105],
        [50.0410, 22.0132], [50.0440, 22.0170], [50.0465, 22.0160],
        [50.0484, 22.0092], [50.0502, 22.0090], [50.0535, 22.0130],
        [50.0560, 22.0150], [50.0560, 22.0225], [50.0525, 22.0235],
        [50.0495, 22.0172], [50.0480, 22.0178], [50.0462, 22.0258],
        [50.0425, 22.0270], [50.0395, 22.0205], [50.0348, 22.0180],
        [50.0305, 22.0105], [50.0260, 22.0060],
      ],
      depthAvgM: 2.9,
      depthMaxM: 4.6,
      currentVelocityMs: 2.4,
      waterLevelDelta: '+22 cm/h (KULMINACJA)',
      areaHectares: 145.4,
    },
  ],
  '12:45': [
    {
      id: 'FLOOD-A1',
      name: 'Strefa rozlewiskowa — stabilizacja wysokiego stanu',
      timeStep: '12:45',
      coordinates: [
        [50.0260, 21.9998], [50.0320, 22.0042], [50.0355, 22.0108],
        [50.0410, 22.0135], [50.0440, 22.0172], [50.0465, 22.0163],
        [50.0484, 22.0095], [50.0502, 22.0093], [50.0535, 22.0133],
        [50.0560, 22.0153], [50.0560, 22.0222], [50.0525, 22.0232],
        [50.0495, 22.0170], [50.0480, 22.0175], [50.0462, 22.0252],
        [50.0425, 22.0265], [50.0395, 22.0202], [50.0348, 22.0178],
        [50.0305, 22.0102], [50.0260, 22.0058],
      ],
      depthAvgM: 2.8,
      depthMaxM: 4.5,
      currentVelocityMs: 1.9,
      waterLevelDelta: '+18 cm/h (STABILIZACJA)',
      areaHectares: 142.1,
    },
  ],
};

// 2. RAPORTY RÓŻNICOWE (CHANGES SINCE LAST FLIGHT)
export const FLIGHT_DIFF_REPORTS: Record<TimeStep, FlightDiffReport> = {
  '12:00': {
    currentStep: '12:00',
    previousStep: null,
    flightName: 'PRZELOT #1 (T-0): ROZPOZNANIE BAZOWE',
    floodedAreaPercentChange: 0,
    floodedAreaHectaresDiff: 0,
    newBlockedRoadsCount: 0,
    newThreatenedBuildingsCount: 1,
    newCriticalAlertsCount: 0,
    newDetectionsCount: 1,
    highlights: [
      'Wody w głównym korycie Wisłoka zbliżają się do korony wałów',
      'Wszystkie główne trasy komunikacyjne przejezdne (DK-97, DW-878)',
      'Wykryto początkowy przesiąk obwałowania w rejonie polderu',
    ],
    tacticalSummary: 'Stan wyjściowy. Dyżurny zleca LOT-01, aby sprawdzić przejezdność drogi.',
  },
  '12:15': {
    currentStep: '12:15',
    previousStep: '12:00',
    flightName: 'PRZELOT #2 (+15 MIN): PROGRESJA ZALANIA',
    floodedAreaPercentChange: 69,
    floodedAreaHectaresDiff: 33.5,
    newBlockedRoadsCount: 1,
    newThreatenedBuildingsCount: 2,
    newCriticalAlertsCount: 0,
    newDetectionsCount: 1,
    highlights: [
      '+69% obszaru zalanego (+33.5 ha)',
      '1 nowa droga nieprzejezdna (ul. Nadrzeczna zalana na 50 cm)',
      '2 budynki mieszkalne bezpośrednio zagrożone odcięciem',
      'Wykryto formujący się zator z pni pod filarem mostu',
    ],
    tacticalSummary: 'Woda zaczyna wylewać się poza wały. Odcięty dojazd kołowy do osiedla nadrzecznego. Wymagane użycie łodzi.',
  },
  '12:30': {
    currentStep: '12:30',
    previousStep: '12:15',
    flightName: 'PRZELOT #3 (+30 MIN): KULMINACJA FALI POWODZIOWEJ',
    floodedAreaPercentChange: 77,
    floodedAreaHectaresDiff: 63.4,
    newBlockedRoadsCount: 2,
    newThreatenedBuildingsCount: 7,
    newCriticalAlertsCount: 1,
    newDetectionsCount: 2,
    highlights: [
      '+77% obszaru zalanego (+63.4 ha wylewu)',
      '2 drogi nieprzejezdne (krytyczne przerwanie korytarza DW-878)',
      '7 budynków zagrożonych (w tym 2 o statusie PRIORYTET KONTROLI)',
      '1 nowa sprawa krytyczna oznaczona przez operatora do weryfikacji',
    ],
    tacticalSummary: 'Kulminacja fali. Gwałtowne przerwanie arterii DW-878 i zagrożenie życia mieszkańców osiedla. Dron namierzył uwięziony pojazd i osoby na dachu.',
  },
  '12:45': {
    currentStep: '12:45',
    previousStep: '12:30',
    flightName: 'PRZELOT #4 (+45 MIN): NALOT WERYFIKACYJNY / INTERWENCJA',
    floodedAreaPercentChange: -2.3,
    floodedAreaHectaresDiff: -3.3,
    newBlockedRoadsCount: 0,
    newThreatenedBuildingsCount: 0,
    newCriticalAlertsCount: 0,
    newDetectionsCount: 0,
    highlights: [
      '-2.3% spadek lustra wody (-3.3 ha stabilizacja polderu)',
      '0 nowych blokad drogowych (utrzymany korytarz ewakuacyjny DK-97)',
      'LOT-02 potwierdził utrzymywanie się wody na odcinku',
      'Zrzut zapory big-bag ograniczył wyrwę w wale o 60%',
    ],
    tacticalSummary: 'Ponowny lot aktualizuje czas i status sprawy. Decyzja dyżurnego pozostaje aktywna.',
  },
};

// Baza dróg z przypisaniem do snapshotów
const ALL_BASE_ROADS: RoadFeature[] = [
  {
    id: 'ROAD-DW878',
    name: 'DW-878 — dojazd do Mostu Załęskiego',
    roadNumber: 'DW-878',
    status: 'IMPASSABLE',
    coordinates: [
      [50.04958, 22.00945],
      [50.04946, 22.00993],
      [50.04915, 22.01081],
      [50.04902, 22.01190],
      [50.04897, 22.01249],
      [50.04895, 22.01344],
    ],
    lengthKm: 1.4,
    waterDepthCm: 75,
    description: 'Syntetyczne zalanie zachodniego dojazdu do przeprawy. Woda przechodzi przez jezdnię; wymagane potwierdzenie operatora i zamknięcie odcinka.',
    recommendedDetour: 'Skierować ruch na inną przeprawę wskazaną i zweryfikowaną przez zarządcę drogi.',
    lastInspectionTime: '12:28:40 (Dron BIELIK-1)',
    firstAppearedStep: '12:30',
  },
  {
    id: 'ROAD-NADRZECZNA',
    name: 'Ul. Nadrzeczna (Dojazd do osiedla)',
    roadNumber: 'Gmina-104A',
    status: 'IMPASSABLE',
    coordinates: [
      [50.0448, 22.0238],
      [50.0459, 22.0247],
      [50.0470, 22.0240],
    ],
    lengthKm: 0.8,
    waterDepthCm: 50,
    description: 'Woda odcięła mostek wjazdowy. Utrudniony dojazd kołowy dla służb ratunkowych. Konieczny transport wodny/amfibia.',
    recommendedDetour: 'Brak alternatywnego dojazdu kołowego. Wyznaczono korytarz ewakuacji łodziowej.',
    lastInspectionTime: '12:24:12 (Dron BIELIK-1)',
    firstAppearedStep: '12:15',
  },
  {
    id: 'ROAD-MOST-WISLOK',
    name: 'Trasa Mostowa (Odcinek przyczółka mostu)',
    roadNumber: 'DP-1382R',
    status: 'THREATENED',
    coordinates: [
      [50.03885, 22.0138],
      [50.03888, 22.01527],
      [50.03890, 22.0168],
    ],
    lengthKm: 0.6,
    waterDepthCm: 15,
    description: 'Woda sięga krawędzi jezdni. Zator pod filarem powoduje cofkę i lokalne spiętrzenie napierające na filar mostowy.',
    recommendedDetour: 'Wprowadzono zakaz wjazdu pojazdów ciężarowych powyżej 3.5t. Ograniczenie prędkości do 30 km/h.',
    lastInspectionTime: '12:26:05 (Dron BIELIK-1)',
    firstAppearedStep: '12:15',
  },
  {
    id: 'ROAD-WALOWA',
    name: 'Droga techniczna wzdłuż wału polderowego',
    roadNumber: 'Gmina-Tech',
    status: 'THREATENED',
    coordinates: [
      [50.0490, 22.0140],
      [50.0520, 22.0190],
      [50.0545, 22.0230],
    ],
    lengthKm: 0.9,
    waterDepthCm: 20,
    description: 'Nasiąkanie podbudowy wału, rozmiękanie korony drogi. Dopuszczony wyłącznie ciężki sprzęt umacniający wały.',
    recommendedDetour: 'Droga zamknięta dla ruchu cywilnego.',
    lastInspectionTime: '12:12:30 (Dron BIELIK-1)',
    firstAppearedStep: '12:00',
  },
  {
    id: 'ROAD-DK97',
    name: 'Wschodni korytarz ewakuacyjny (poza strefą zalania)',
    roadNumber: 'DK-97',
    status: 'PASSABLE',
    coordinates: [
      [50.0365, 22.0327],
      [50.0425, 22.0323],
      [50.0487, 22.0302],
      [50.0530, 22.0280],
    ],
    lengthKm: 3.2,
    description: 'Trasa sucha, wzniesiona ponad rzędną 100-letniej wody powodziowej. Pełna przepustowość. Patrol Policji na skrzyżowaniach.',
    recommendedDetour: 'Główny zalecany korytarz dla kolumn ratowniczych PSP i transportu ewakuowanych.',
    lastInspectionTime: '12:29:00 (BDOT10k / Patrol)',
    firstAppearedStep: '12:00',
  },
  {
    id: 'ROAD-OBJAZD-ZACHOD',
    name: 'Trasa Zachodnia Krasne - Krasiecko (Objazd)',
    roadNumber: 'DW-883',
    status: 'PASSABLE',
    coordinates: [
      [50.0240, 21.9600],
      [50.0310, 21.9650],
      [50.0410, 21.9720],
      [50.0490, 21.9800],
    ],
    lengthKm: 2.8,
    description: 'Nawierzchnia sucha, brak zagrożenia zalaniem. Wyznaczono punkty tankowania dla pojazdów ratowniczych.',
    recommendedDetour: 'Alternatywny korytarz zaopatrzenia dla sztabu kryzysowego.',
    lastInspectionTime: '12:15:00 (Patrol KPP)',
    firstAppearedStep: '12:00',
  },
];

// Generowanie stanu dróg dla konkretnego kroku czasowego
export function getRoadsForTimeStep(step: TimeStep): RoadFeature[] {
  if (step === '12:00') {
    return ALL_BASE_ROADS.map(r => {
      if (r.id === 'ROAD-DW878') return { ...r, status: 'PASSABLE', waterDepthCm: 0, description: 'Droga sucha, woda w korycie Wisłoka.' };
      if (r.id === 'ROAD-NADRZECZNA') return { ...r, status: 'THREATENED', waterDepthCm: 5, description: 'Woda w rowach przydrożnych.' };
      if (r.id === 'ROAD-MOST-WISLOK') return { ...r, status: 'PASSABLE', waterDepthCm: 0 };
      return r;
    });
  }
  if (step === '12:15') {
    return ALL_BASE_ROADS.map(r => {
      if (r.id === 'ROAD-DW878') return { ...r, status: 'THREATENED', waterDepthCm: 15, description: 'Woda dochodzi do pobocza.' };
      if (r.id === 'ROAD-NADRZECZNA') return { ...r, status: 'IMPASSABLE', waterDepthCm: 50 };
      return r;
    });
  }
  // 12:30 i 12:45
  return ALL_BASE_ROADS;
}

// Baza budynków z przypisaniem do snapshotów
const ALL_BASE_BUILDINGS: BuildingFeature[] = [
  {
    id: 'BLD-01',
    address: 'ul. Nadrzeczna 14A',
    buildingType: 'Mieszkalny',
    status: 'INSPECTION_PRIORITY',
    coordinates: [50.0459, 22.0247],
    residentsReported: 4,
    waterDistanceM: 0,
    hazardNotes: 'Parter całkowicie zalany. Cztery osoby dorosłe i dwoje dzieci na balkonie I piętra. Wymachiwanie flagą sygnalizacyjną.',
    recommendedAction: 'Natychmiastowe skierowanie łodzi płaskodennej OSP z ratownikami medycznymi celem ewakuacji.',
    droneVerified: true,
    firstAppearedStep: '12:30',
  },
  {
    id: 'BLD-02',
    address: 'ul. Nadrzeczna 18',
    buildingType: 'Mieszkalny',
    status: 'INSPECTION_PRIORITY',
    coordinates: [50.0464, 22.0243],
    residentsReported: 2,
    waterDistanceM: 0,
    hazardNotes: 'Budynek parterowy odcięty ze wszystkich stron. Woda sięga parapetów okiennych. Osoby starsze wymagające tlenoterapii.',
    recommendedAction: 'Priorytet dla zespołu ratownictwa wodnego PSP/OSP.',
    droneVerified: true,
    firstAppearedStep: '12:30',
  },
  {
    id: 'BLD-03',
    address: 'ul. Rzeczna 3 (Stacja GPZ Podstacja Trafo)',
    buildingType: 'Infrastruktura krytyczna',
    status: 'THREATENED',
    coordinates: [50.0522, 22.0205],
    residentsReported: 0,
    waterDistanceM: 12,
    hazardNotes: 'Rozlewisko zbliża się z prędkością 1m/10min. Zagrożenie odcięciem zasilania dla 15 000 mieszkańców aglomeracji.',
    recommendedAction: 'Ocena potrzeby zabezpieczenia odcinka przez właściwe służby i operatora infrastruktury.',
    droneVerified: true,
    firstAppearedStep: '12:00',
  },
  {
    id: 'BLD-04',
    address: 'ul. Spacerowa 9 (Oczyszczalnia ścieków)',
    buildingType: 'Infrastruktura krytyczna',
    status: 'THREATENED',
    coordinates: [50.0392, 22.0170],
    residentsReported: 6,
    waterDistanceM: 25,
    hazardNotes: 'Podwyższony stan wód w kolektorach burzowych. Ryzyko zalania komór napowietrzania.',
    recommendedAction: 'Uruchomienie rezerwowych agregatów i pomp szlamowych o dużej wydajności.',
    droneVerified: true,
    firstAppearedStep: '12:15',
  },
  {
    id: 'BLD-05',
    address: 'Szkoła Podstawowa im. Obrońców Rzeszowa, ul. Wzgórze 1',
    buildingType: 'Użyteczności publicznej',
    status: 'SAFE',
    coordinates: [50.0430, 22.0300],
    residentsReported: 0,
    waterDistanceM: 450,
    hazardNotes: 'Obiekt zlokalizowany na wzniesieniu (215m n.p.m.). Pełna infrastruktura sanitarna i kuchenna.',
    recommendedAction: 'Aktywowano jako Główny Punkt Zborny i Tymczasowe Miejsce Pobytu dla ewakuowanych mieszkańców.',
    droneVerified: true,
    firstAppearedStep: '12:00',
  },
  {
    id: 'BLD-06',
    address: 'Baza Operacyjna OSP / Magazyn Przeciwpowodziowy',
    buildingType: 'Użyteczności publicznej',
    status: 'SAFE',
    coordinates: [50.0510, 22.0060],
    residentsReported: 18,
    waterDistanceM: 320,
    hazardNotes: 'Suchy dojazd z trasy DK-97. Magazyn wyposażony w 20 000 worków z piaskiem i 4 pompy wysokociśnieniowe.',
    recommendedAction: 'Punkt logistyczny i zaopatrzeniowy dla służb ratunkowych.',
    droneVerified: true,
    firstAppearedStep: '12:00',
  },
];

// Generowanie stanu budynków dla konkretnego kroku czasowego
export function getBuildingsForTimeStep(step: TimeStep): BuildingFeature[] {
  if (step === '12:00') {
    return ALL_BASE_BUILDINGS.map(b => {
      if (b.id === 'BLD-01' || b.id === 'BLD-02') return { ...b, status: 'SAFE', waterDistanceM: 120, hazardNotes: 'Woda w korycie rzeki, brak zagrożenia.' };
      if (b.id === 'BLD-04') return { ...b, status: 'SAFE', waterDistanceM: 90 };
      return b;
    });
  }
  if (step === '12:15') {
    return ALL_BASE_BUILDINGS.map(b => {
      if (b.id === 'BLD-01' || b.id === 'BLD-02') return { ...b, status: 'THREATENED', waterDistanceM: 15, hazardNotes: 'Woda wdarła się na działki, odcięcie drogi dojazdowej.' };
      return b;
    });
  }
  if (step === '12:45') {
    return ALL_BASE_BUILDINGS.map(b => {
      if (b.id === 'BLD-01') return { ...b, hazardNotes: 'Zespół ratowniczy prowadzi działania w syntetycznym scenariuszu.', recommendedAction: 'Ponowna weryfikacja po zakończeniu działania.' };
      if (b.id === 'BLD-02') return { ...b, status: 'SAFE', hazardNotes: 'Mieszkańcy ewakuowani do Szkoły Podstawowej.', recommendedAction: 'Budynek sprawdzony i zabezpieczony.' };
      return b;
    });
  }
  return ALL_BASE_BUILDINGS;
}

// Baza detekcji drona
const ALL_BASE_DETECTIONS: DroneDetectionPoint[] = [
  {
    id: 'DET-01',
    type: 'PERSON',
    title: 'Możliwa osoba wzywająca pomocy na dachu',
    coordinates: [50.0459, 22.0247],
    confidence: 97.4,
    detectedAt: '12:27:15',
    droneCallsign: 'BIELIK-1',
    sensor: 'EO/IR Dual Thermal 4K (FLIR Boson)',
    description: 'Kamera termowizyjna wykryła sygnaturę cieplną odpowiadającą 2 osobom na połaci dachowej. Wykryto ruch ramion sygnalizujący prośbę o pomoc (gest S.O.S.).',
    recommendedAction: 'Natychmiastowy priorytet podjęcia łodzią motorową OSP lub śmigłowcem LPR/SAR.',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    status: 'NOWY',
    firstAppearedStep: '12:30',
  },
  {
    id: 'DET-02',
    type: 'VEHICLE',
    title: 'Zatopiony pojazd osobowy zepchnięty do rowu',
    coordinates: [50.0490, 22.0122],
    confidence: 94.2,
    detectedAt: '12:28:02',
    droneCallsign: 'BIELIK-1',
    sensor: 'Optical Zoom 30x (Detekcja Bounding-Box)',
    description: 'Pojazd marki SUV zepchnięty przez napór wody na pobocze trasy DW-878. Lustro wody sięga dolnej krawędzi szyb. Wymagana pilna weryfikacja czy w środku znajdują się osoby.',
    recommendedAction: 'Zadysponowanie nurków Państwowej Straży Pożarnej do przeszukania kabiny pojazdu.',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    status: 'NOWY',
    firstAppearedStep: '12:30',
  },
  {
    id: 'DET-03',
    type: 'OBSTACLE',
    title: 'Masywny zator z połamanych drzew przy filarze mostu',
    coordinates: [50.0389, 22.0153],
    confidence: 92.8,
    detectedAt: '12:25:40',
    droneCallsign: 'BIELIK-1',
    sensor: 'LiDAR + Optical Fusion',
    description: 'Zgromadzenie około 35 metrów sześciennych pni i konarów drzew zablokowanych o środkowy filar mostu. Spiętrzenie wody o 80 cm wyżej niż po stronie odpływowej.',
    recommendedAction: 'Wprowadzić dźwig z chwytakiem hydraulicznym PSP lub ładunki rozpraszające wojsk inżynieryjnych.',
    imageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    status: 'WERYFIKACJA',
    firstAppearedStep: '12:15',
  },
  {
    id: 'DET-04',
    type: 'INFRASTRUCTURE_DAMAGE',
    title: 'Przerwanie wału przeciwpowodziowego polderu',
    coordinates: [50.0462, 22.0212],
    confidence: 96.1,
    detectedAt: '12:22:18',
    droneCallsign: 'BIELIK-1',
    sensor: 'Hyperspectral & Ortho Recon',
    description: 'Wyrwa o szerokości ok. 8 metrów w koronie obwałowania ziemnego. Woda przelewa się w tempie 4.5 m³/s w kierunku rowów melioracyjnych i zabudowań gospodarczych.',
    recommendedAction: 'Zrzut worków typu big-bag ze śmigłowca Mi-17 lub ułożenie zapory z gabionów.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'ZADYSPONOWANO',
    firstAppearedStep: '12:00',
  },
];

// Generowanie detekcji drona dla konkretnego kroku czasowego
export function getDroneDetectionsForTimeStep(step: TimeStep): DroneDetectionPoint[] {
  const timeOrder: Record<TimeStep, number> = {
    '12:00': 1,
    '12:15': 2,
    '12:30': 3,
    '12:45': 4,
  };

  const currentOrder = timeOrder[step];
  return ALL_BASE_DETECTIONS.filter(d => {
    const dOrder = timeOrder[d.firstAppearedStep || '12:00'];
    return dOrder <= currentOrder;
  }).map(d => {
    if (step === '12:45') {
      if (d.id === 'DET-01') return { ...d, status: 'ZADYSPONOWANO', description: 'Osoby bezpiecznie podjęte do amfibii PTS-M.' };
      if (d.id === 'DET-02') return { ...d, status: 'WERYFIKACJA', description: 'Płetwonurek PSP potwierdził brak osób w pojeździe.' };
      if (d.id === 'DET-04') return { ...d, status: 'ZADYSPONOWANO', description: 'Zapora faszynowa ustabilizowała wyrwę.' };
    }
    return d;
  });
}

// Eksporty domyślne dla kompatybilności
export const SITUATIONAL_ROADS = ALL_BASE_ROADS;
export const SITUATIONAL_BUILDINGS = ALL_BASE_BUILDINGS;
export const SITUATIONAL_DRONE_DETECTIONS = ALL_BASE_DETECTIONS;
