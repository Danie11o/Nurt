import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Plus, 
  Minus, 
  RotateCcw, 
  Navigation, 
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  AlertIncident, 
  DroneMission, 
  TimeStep, 
  RoadFeature, 
  BuildingFeature, 
  DroneDetectionPoint, 
  MapSelectedItem,
  RetaskTarget
} from '../types';
import { SITUATIONAL_FLOOD_AREAS } from '../data/situationalData';

interface MapComponentProps {
  alerts: AlertIncident[];
  roads: RoadFeature[];
  buildings: BuildingFeature[];
  droneDetections: DroneDetectionPoint[];
  selectedItem: MapSelectedItem | null;
  onSelectItem: (item: MapSelectedItem | null) => void;
  activeTimeStep: TimeStep;
  drone: DroneMission;
  onInspectDroneModal?: (alert: AlertIncident) => void;
  focusTarget?: { coords: [number, number]; zoom?: number; id?: string; timestamp: number } | null;
  retaskTarget?: RetaskTarget | null;
}

// Baza naturalnego koryta Wisłoka w Rzeszowie (dla podkładu lokalnego GIS / offline)
const WISLOK_RIVER_CHANNEL: [number, number][] = [
  [50.0204756, 22.0000259],
  [50.0265365, 22.0029193],
  [50.0316672, 22.0071048],
  [50.0341601, 22.0128482],
  [50.0353617, 22.0136440],
  [50.0405744, 22.0164764],
  [50.0436030, 22.0208216],
  [50.0458240, 22.0200285],
  [50.0479549, 22.0135187],
  [50.0496193, 22.0132158],
  [50.0514878, 22.0167311],
  [50.0529548, 22.0194127],
  [50.0549877, 22.0187714],
  [50.0584030, 22.0144631],
  [50.0616612, 22.0155064],
  [50.0648904, 22.0185265],
];

// Siatka taktyczna dla trybu offline (WGS84)
const OFFLINE_GRID_LINES = [
  // Równoleżniki
  [[50.0250, 21.9600], [50.0250, 22.0300]],
  [[50.0350, 21.9600], [50.0350, 22.0300]],
  [[50.0450, 21.9600], [50.0450, 22.0300]],
  [[50.0550, 21.9600], [50.0550, 22.0300]],
  // Południki
  [[50.0200, 21.9700], [50.0600, 21.9700]],
  [[50.0200, 21.9900], [50.0600, 21.9900]],
  [[50.0200, 22.0100], [50.0600, 22.0100]],
  [[50.0200, 22.0300], [50.0600, 22.0300]],
];

// Granice Sektora B-4 (Osiedle nadrzeczne odcięte przez wodę)
const SEKTOR_B4_POLYGON: [number, number][] = [
  [50.0423, 22.0218],
  [50.0468, 22.0215],
  [50.0478, 22.0275],
  [50.0420, 22.0280],
];

export const MapComponent: React.FC<MapComponentProps> = ({
  alerts,
  roads,
  buildings,
  droneDetections,
  selectedItem,
  onSelectItem,
  activeTimeStep,
  drone,
  focusTarget,
  retaskTarget,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Domyślny basemap: Prawdziwa ortofotomapa satelitarna (Esri World Imagery)
  const [mapStyle, setMapStyle] = useState<'SATELLITE' | 'STREET' | 'OFFLINE'>('SATELLITE');
  const [isAutoOffline, setIsAutoOffline] = useState(false);
  
  // Przełączniki warstw
  const [showFlood, setShowFlood] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showDetections, setShowDetections] = useState(true);
  const [showDroneFov, setShowDroneFov] = useState(true);
  const [showFlightPlan, setShowFlightPlan] = useState(true);
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);

  // Inicjalizacja instancji mapy wycentrowanej na Rzeszowie (dolina Wisłoka, Zapora, DW-878)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Faktyczny obszar scenariusza: dolina Wisłoka i Most Załęski / DW-878.
    const map = L.map(mapContainerRef.current, {
      center: [50.0445, 22.0170],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Domyślna ortofotomapa satelitarna wysokiej rozdzielczości: Esri World Imagery (przyciemniona o 14% dla czytelności C2)
    const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      className: 'satellite-tiles',
      attribution: '&copy; Esri &mdash; Maxar, Earthstar Geographics',
    });

    let failureCount = 0;
    tileLayer.on('tileerror', () => {
      failureCount++;
      // Przełącz w tryb awaryjny offline dopiero po wielokrotnej awarii sieci
      if (failureCount > 8) {
        setIsAutoOffline(true);
        setMapStyle('OFFLINE');
      }
    });

    tileLayer.addTo(map);
    (map as any)._baseTileLayer = tileLayer;

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Przełączanie stylu podkładu (MAPA ULICZNA / ORTOFOTOMAPA / TRYB OFFLINE)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const oldTile = (map as any)._baseTileLayer;
    if (oldTile) {
      map.removeLayer(oldTile);
      (map as any)._baseTileLayer = null;
    }

    if (mapStyle === 'OFFLINE') {
      // W trybie offline kafelki internetowe nie są pobierane; tło renderuje lokalny GIS wektorowy
      return;
    }

    let newTile: L.TileLayer;
    if (mapStyle === 'STREET') {
      // Prawdziwa mapa uliczna: Carto Voyager
      newTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      });
    } else {
      // Ortofotomapa satelitarna wysokiej rozdzielczości: Esri World Imagery
      newTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        className: 'satellite-tiles',
        attribution: '&copy; Esri',
      });
    }

    let failureCount = 0;
    newTile.on('tileerror', () => {
      failureCount++;
      if (failureCount > 8) {
        setIsAutoOffline(true);
      }
    });

    newTile.addTo(map);
    (map as any)._baseTileLayer = newTile;
  }, [mapStyle]);

  // Główna pętla renderowania nakładek sytuacji kryzysowej (GIS)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const isOfflineActive = mapStyle === 'OFFLINE' || isAutoOffline;

    // A. WEKTORY SPECJALNE DLA TRYBU OFFLINE (Siatka taktyczna, obrys rzeki, sektor B-4)
    if (isOfflineActive) {
      // 1. Siatka współrzędnych WGS84
      OFFLINE_GRID_LINES.forEach((lineCoords) => {
        L.polyline(lineCoords as [number, number][], {
          color: '#334155',
          weight: 1,
          dashArray: '4, 8',
          opacity: 0.5,
          interactive: false,
        }).addTo(group);
      });

      // 2. Koryto główne Wisłoka (mocna oś hydrologiczna offline)
      L.polyline(WISLOK_RIVER_CHANNEL, {
        color: '#0284c7',
        weight: 8,
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
      }).addTo(group);

      // 3. Wielokąt Sektora B-4
      L.polygon(SEKTOR_B4_POLYGON, {
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#f59e0b',
        fillOpacity: 0.08,
      }).addTo(group);
    }

    // Etykieta stała: Rzeka Wisłok
    const riverLabelIcon = L.divIcon({
      html: `
        <div class="px-1.5 py-0.5 rounded bg-slate-950/80 border border-sky-600/60 font-mono text-[9px] font-bold text-sky-300 tracking-wider uppercase select-none pointer-events-none whitespace-nowrap shadow-md">
          ≈ RZEKA WISŁOK ≈
        </div>
      `,
      className: 'river-label',
      iconSize: [110, 18],
      iconAnchor: [55, 9],
    });
    L.marker([50.0436, 22.0208], { icon: riverLabelIcon }).addTo(group);

    // Etykieta stała: Sektor B-4
    const sectorLabelIcon = L.divIcon({
      html: `
        <div class="px-1.5 py-0.5 rounded bg-slate-950/90 border border-amber-500 text-[9px] font-mono font-bold text-amber-300 tracking-wider select-none pointer-events-none whitespace-nowrap shadow-md">
          SEKTOR B-4 (OSIEDLE)
        </div>
      `,
      className: 'sector-label',
      iconSize: [130, 20],
      iconAnchor: [65, 10],
    });
    L.marker([50.0465, 22.0085], { icon: sectorLabelIcon }).addTo(group);

    // 1. WARSTWA POWODZI (Ciemnoniebieskie wypełnienie 40%, wyraźny obrys, wysoki kontrast na ulicach)
    if (showFlood) {
      const floodAreas = SITUATIONAL_FLOOD_AREAS[activeTimeStep] || [];
      floodAreas.forEach((flood) => {
        // Ciemnoniebieski casing głębinowy pod spodem
        L.polygon(flood.coordinates, {
          color: '#0369a1',
          weight: 4,
          opacity: 0.7,
          fill: false,
          interactive: false,
        }).addTo(group);

        // Główny wielokąt zalania z subtelnym wzorem nurtu krawędzi
        const polygon = L.polygon(flood.coordinates, {
          color: '#38bdf8',
          weight: 2.5,
          opacity: 0.95,
          dashArray: '8, 6',
          fillColor: '#0284c7',
          fillOpacity: 0.42,
        }).addTo(group);

        polygon.on('click', () => {
          onSelectItem({ kind: 'FLOOD', data: flood });
        });

        polygon.bindTooltip(
          `<div class="p-1 font-mono text-[10px] text-cyan-300 font-bold">
            🌊 ${flood.name}<br/>
            <span class="text-slate-200">Głębokość maks: ${flood.depthMaxM}m • Przyrost: ${flood.waterLevelDelta}</span>
           </div>`,
          { sticky: true, className: 'nurt-map-tooltip' }
        );
      });
    }

    // 2. DROGI (Neutralne cienkie, zagrożone grubsze, nieprzejezdne mocne czerwone przerywane)
    if (showRoads) {
      roads.forEach((road) => {
        const isImpassable = road.status === 'IMPASSABLE';
        const isThreatened = road.status === 'THREATENED';
        const isSelected = selectedItem?.kind === 'ROAD' && selectedItem.data.id === road.id;
        const isDW878 = road.roadNumber === 'DW-878';

        // Ciemny podrys (casing) pod każdą drogą dla czytelności na jasnej mapie ulicznej i satelicie
        L.polyline(road.coordinates, {
          color: '#000000',
          weight: isImpassable ? 7 : isThreatened ? 5.5 : 3.5,
          opacity: 0.45,
          interactive: false,
        }).addTo(group);

        // Wyróżnienie najważniejszej drogi (DW-878 lub selekcja sztabowa)
        if (isSelected || isDW878) {
          L.polyline(road.coordinates, {
            color: '#38bdf8',
            weight: 9,
            opacity: 0.4,
            interactive: false,
          }).addTo(group);
        }

        if (isImpassable) {
          // Główna linia przerywana nieprzejezdna (jaskrawy czerwony)
          const polyline = L.polyline(road.coordinates, {
            color: '#ef4444',
            weight: 4.5,
            opacity: 0.95,
            dashArray: '6, 6',
          }).addTo(group);

          polyline.on('click', () => {
            onSelectItem({ kind: 'ROAD', data: road });
          });

          polyline.bindTooltip(
            `<div class="p-1 font-mono text-[10px]">
              <strong class="text-rose-400">[NIEPRZEJEZDNA] ${road.name}</strong><br/>
              <span class="text-slate-300">Woda: ${road.waterDepthCm || 0} cm • ${road.description.slice(0, 50)}...</span>
             </div>`,
            { sticky: true, className: 'nurt-map-tooltip' }
          );

          // Stała etykieta dla kluczowej magistrali DW-878
          if (isDW878 && selectedItem?.kind !== 'ALERT') {
            const midCoord = road.coordinates[Math.floor(road.coordinates.length / 2)];
            const dwLabelIcon = L.divIcon({
              html: `
                <div class="px-1.5 py-0.5 rounded bg-rose-950/95 border border-rose-500 text-[8px] font-mono font-bold text-rose-200 whitespace-nowrap shadow select-none pointer-events-none">
                  DW-878 [ODCIĘTA]
                </div>
              `,
              className: 'dw-label',
              iconSize: [95, 18],
              iconAnchor: [47, 9],
            });
            L.marker(midCoord, { icon: dwLabelIcon }).addTo(group);
          }
        } else if (isThreatened) {
          const polyline = L.polyline(road.coordinates, {
            color: '#f59e0b',
            weight: 3.5,
            opacity: 0.9,
          }).addTo(group);

          polyline.on('click', () => {
            onSelectItem({ kind: 'ROAD', data: road });
          });

          polyline.bindTooltip(
            `<div class="p-1 font-mono text-[10px]">
              <strong class="text-amber-400">[ZAGROŻONA] ${road.name}</strong>
             </div>`,
            { sticky: true, className: 'nurt-map-tooltip' }
          );
        } else {
          // Przejezdna - cienka neutralna/zielonkawa
          const polyline = L.polyline(road.coordinates, {
            color: '#16a34a',
            weight: 2.5,
            opacity: 0.85,
          }).addTo(group);

          polyline.on('click', () => {
            onSelectItem({ kind: 'ROAD', data: road });
          });

          polyline.bindTooltip(
            `<div class="p-1 font-mono text-[10px] text-emerald-300">
              <strong>[PRZEJEZDNA] ${road.name}</strong>
             </div>`,
            { sticky: true, className: 'nurt-map-tooltip' }
          );
        }
      });
    }

    // 3. BUDYNKI (Zredukowany szum wizualny: subtelne punkty GIS z wyraźnym obrysem)
    if (showBuildings) {
      buildings.forEach((bld) => {
        const isPriority = bld.status === 'INSPECTION_PRIORITY';
        const isThreatened = bld.status === 'THREATENED';

        const color = isPriority ? '#ef4444' : isThreatened ? '#f59e0b' : '#64748b';
        const radius = isPriority ? 6 : isThreatened ? 5 : 3.5;
        const fillOpacity = isPriority ? 0.95 : isThreatened ? 0.9 : 0.6;

        const circle = L.circleMarker(bld.coordinates, {
          radius,
          color: isPriority ? '#ffffff' : isThreatened ? '#000000' : '#1e293b',
          weight: isPriority ? 2 : 1,
          fillColor: color,
          fillOpacity,
        }).addTo(group);

        circle.on('click', () => {
          onSelectItem({ kind: 'BUILDING', data: bld });
        });

        circle.bindTooltip(
          `<div class="p-1 font-mono text-[10px]">
            <div class="font-bold text-white">${bld.address}</div>
            <div class="text-slate-300">Status: <span style="color:${color}">${bld.status}</span> • Mieszkańcy: ${bld.residentsReported}</div>
           </div>`,
          { sticky: true, className: 'nurt-map-tooltip' }
        );
      });
    }

    // 4. PUNKTY WYKRYTE PRZEZ DRONA (Uproszczone, czytelne wskaźniki)
    if (showDetections) {
      droneDetections.forEach((det) => {
        const isPerson = det.type === 'PERSON';
        const isDamage = det.type === 'INFRASTRUCTURE_DAMAGE';
        const colorClass = isPerson ? 'bg-rose-600 border-white text-white' : isDamage ? 'bg-purple-600 border-white text-white' : 'bg-cyan-600 border-white text-white';
        const symbol = isPerson ? '👤' : isDamage ? '⚡' : '🚗';

        const detHtml = `
          <div class="relative flex items-center justify-center w-6 h-6 cursor-pointer select-none">
            <div class="w-5 h-5 rounded-full ${colorClass} border-2 flex items-center justify-center text-[9px] shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              ${symbol}
            </div>
          </div>
        `;

        const detIcon = L.divIcon({
          html: detHtml,
          className: 'custom-detection-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(det.coordinates, { icon: detIcon }).addTo(group);
        marker.on('click', () => {
          onSelectItem({ kind: 'DETECTION', data: det });
        });

        marker.bindTooltip(
          `<div class="p-1 font-mono text-[10px]">
            <div class="font-bold text-cyan-300">WYKRYCIE: ${det.title}</div>
            <div class="text-slate-300">Pewność: ${det.confidence}% • Czas: ${det.detectedAt}</div>
           </div>`,
          { sticky: true, className: 'nurt-map-tooltip' }
        );
      });
    }

    // 5. TRASA I SEKTOR LOTU DRONA (Subtelna trajektoria C2)
    if (showFlightPlan) {
      if (drone.plannedAreaCoordinates && drone.plannedAreaCoordinates.length > 0) {
        L.polygon(drone.plannedAreaCoordinates, {
          color: '#06b6d4',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: '#06b6d4',
          fillOpacity: 0.05,
          interactive: false,
        }).addTo(group);
      }

      if (drone.flightPathCoordinates && drone.flightPathCoordinates.length > 0) {
        L.polyline(drone.flightPathCoordinates, {
          color: '#0891b2',
          weight: 2,
          opacity: 0.75,
          dashArray: '4, 4',
          interactive: false,
        }).addTo(group);

        drone.flightPathCoordinates.forEach((wp) => {
          L.circleMarker(wp, {
            radius: 2.5,
            color: '#ffffff',
            weight: 1,
            fillColor: '#0891b2',
            fillOpacity: 0.9,
            interactive: false,
          }).addTo(group);
        });
      }
    }

    // 6. ZNACZNIK DRONA I STOŻEK KAMERY (FOV)
    const droneCoords = drone.coordinates;

    // Obliczenie kierunku stożka FOV (jeśli jest retaskTarget -> FOV celuje w cel)
    let fovAngleRad = (drone.heading * Math.PI) / 180;
    if (retaskTarget) {
      const dLat = retaskTarget.coords[0] - droneCoords[0];
      const dLng = retaskTarget.coords[1] - droneCoords[1];
      fovAngleRad = Math.atan2(dLng, dLat); // orientacja bezpośrednio w cel
    }

    if (showDroneFov) {
      const coneDist = 0.0055;
      const coneSpread = 0.35; // ~20 stopni rozwarcia
      const fovConeCoords: [number, number][] = [
        droneCoords,
        [
          droneCoords[0] + coneDist * Math.cos(fovAngleRad - coneSpread),
          droneCoords[1] + coneDist * Math.sin(fovAngleRad - coneSpread),
        ],
        [
          droneCoords[0] + coneDist * Math.cos(fovAngleRad + coneSpread),
          droneCoords[1] + coneDist * Math.sin(fovAngleRad + coneSpread),
        ],
      ];

      L.polygon(fovConeCoords, {
        color: '#0284c7',
        weight: 1.5,
        dashArray: '3, 3',
        fillColor: '#38bdf8',
        fillOpacity: 0.15,
        interactive: false,
      }).addTo(group);
    }

    // Dron: wyraźny marker ze zorientowaną sylwetką i stałą etykietą
    const isAlertFocus = selectedItem?.kind === 'ALERT';
    const droneHtml = `
      <div class="relative flex items-center justify-center w-8 h-8 select-none pointer-events-auto cursor-pointer">
        <div class="w-7 h-7 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style="transform: rotate(${drone.heading}deg)">
          <svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/>
          </svg>
        </div>
        ${isAlertFocus ? '' : `<div class="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-950 border border-cyan-400 text-[8px] font-mono font-bold text-cyan-300 whitespace-nowrap shadow-md">${drone.callsign} (${drone.altitude}m)</div>`}
      </div>
    `;

    const droneIcon = L.divIcon({
      html: droneHtml,
      className: 'custom-drone-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const droneMarker = L.marker(droneCoords, { icon: droneIcon }).addTo(group);
    droneMarker.bindTooltip(
      `<div class="p-1 font-mono text-[10px]">
        <div class="text-cyan-400 font-bold">${drone.callsign} • PATROL RECON</div>
        <div class="text-slate-300">Wysokość: ${drone.altitude}m | Prędkość: ${drone.speed} km/h</div>
       </div>`,
      { sticky: true, className: 'nurt-map-tooltip' }
    );

    // 7. ZNACZNIKI ALERTÓW (Kontrastowe, czytelne na ulicach i ortofoto)
    alerts.forEach((alert) => {
      const isCritical = alert.severity === 'CRITICAL';
      const isSelected = selectedItem?.kind === 'ALERT' && selectedItem.data.id === alert.id;
      
      const alertHtml = `
        <div class="relative flex items-center justify-center w-9 h-9 cursor-pointer select-none">
          ${isCritical ? '<div class="absolute w-7 h-7 rounded-full border border-rose-500 pulse-critical bg-rose-500/20"></div>' : ''}
          ${isSelected ? '<div class="absolute -inset-1 rounded-full border-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.9)] pointer-events-none"></div>' : ''}
          <div class="w-6 h-6 rounded-full ${isCritical ? 'bg-rose-600 border-2 border-white text-white' : 'bg-amber-500 border-2 border-slate-900 text-slate-950'} flex items-center justify-center text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${isSelected ? 'ring-2 ring-cyan-400' : ''}">
            ${isCritical ? '!' : '▲'}
          </div>
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-950 border ${isSelected ? 'border-cyan-400 text-cyan-200 font-extrabold shadow-[0_0_8px_rgba(6,182,212,0.5)]' : isCritical ? 'border-rose-500 text-rose-300' : 'border-amber-500 text-amber-300'} text-[8px] font-mono whitespace-nowrap shadow-md">
            ${alert.id}
          </div>
        </div>
      `;

      const alertIcon = L.divIcon({
        html: alertHtml,
        className: 'custom-alert-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(alert.coordinates, { icon: alertIcon }).addTo(group);
      marker.on('click', () => {
        onSelectItem({ kind: 'ALERT', data: alert });
      });

      marker.bindTooltip(
        `<div class="p-1 font-mono text-[10px]">
          <div class="font-bold ${isCritical ? 'text-rose-400' : 'text-amber-400'}">[${alert.severity}] ${alert.title}</div>
          <div class="text-slate-300">Wskaźnik priorytetu: ${alert.priorityScore}/100</div>
          <div class="text-cyan-300 text-[9px] mt-0.5">Lokalizacja: ${alert.location}</div>
         </div>`,
        { sticky: true, className: 'nurt-map-tooltip' }
      );
    });

    // 8. CEL PO RE-TASK (TARGET + cienka linia do celu)
    const retaskMatchesSelectedAlert = Boolean(
      retaskTarget && selectedItem?.kind === 'ALERT' && selectedItem.data.id === retaskTarget.alertId
    );

    if (retaskTarget && !retaskMatchesSelectedAlert) {
      const targetHtml = `
        <div class="relative flex items-center justify-center w-8 h-8 select-none pointer-events-none">
          <div class="absolute w-7 h-7 rounded-full border border-amber-300/70 bg-amber-500/10"></div>
          <div class="w-3 h-3 rotate-45 bg-amber-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.75)]"></div>
        </div>
      `;

      const targetIcon = L.divIcon({
        html: targetHtml,
        className: 'custom-retask-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker(retaskTarget.coords, { icon: targetIcon }).addTo(group);
    }

    if (retaskTarget) {
      // Dyskretna linia pokazuje relację dron–cel bez zasłaniania alertu.
      L.polyline([droneCoords, retaskTarget.coords], {
        color: '#f59e0b',
        weight: 1.25,
        dashArray: '4, 4',
        opacity: 0.65,
        interactive: false,
      }).addTo(group);
    }

    // 9. SUBTELNY CELOWNIK SELEKCJI
    if (selectedItem && selectedItem.kind !== 'ALERT') {
      let selCoords: [number, number] | null = null;
      if (selectedItem.kind === 'ROAD') {
        selCoords = selectedItem.data.coordinates[Math.floor(selectedItem.data.coordinates.length / 2)] || selectedItem.data.coordinates[0];
      } else if (selectedItem.kind === 'BUILDING') {
        selCoords = selectedItem.data.coordinates;
      } else if (selectedItem.kind === 'DETECTION') {
        selCoords = selectedItem.data.coordinates;
      } else if (selectedItem.kind === 'FLOOD') {
        selCoords = selectedItem.data.coordinates[0];
      }

      if (selCoords) {
        const reticleHtml = `
          <div class="relative flex items-center justify-center w-10 h-10 pointer-events-none select-none">
            <div class="w-9 h-9 rounded-full border-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            <div class="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-cyan-300 font-bold">┼</div>
          </div>
        `;
        const reticleIcon = L.divIcon({
          html: reticleHtml,
          className: 'custom-reticle-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
        L.marker(selCoords, { icon: reticleIcon }).addTo(group);
      }
    }

  }, [
    alerts,
    roads,
    buildings,
    droneDetections,
    activeTimeStep,
    drone,
    showFlood,
    showRoads,
    showBuildings,
    showDetections,
    showDroneFov,
    showFlightPlan,
    onSelectItem,
    selectedItem,
    retaskTarget,
    mapStyle,
    isAutoOffline,
  ]);

  // Centrowanie mapy na wybranym obiekcie lub zadanym focusTarget (flyTo)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focusTarget && focusTarget.coords) {
      map.flyTo(focusTarget.coords, focusTarget.zoom || 15.5, {
        animate: true,
        duration: 1.0,
      });
      return;
    }

    if (selectedItem) {
      let coords: [number, number] | null = null;
      if (selectedItem.kind === 'ROAD') {
        coords = selectedItem.data.coordinates[Math.floor(selectedItem.data.coordinates.length / 2)] || selectedItem.data.coordinates[0];
      } else if (selectedItem.kind === 'BUILDING') {
        coords = selectedItem.data.coordinates;
      } else if (selectedItem.kind === 'DETECTION') {
        coords = selectedItem.data.coordinates;
      } else if (selectedItem.kind === 'ALERT') {
        coords = selectedItem.data.coordinates;
      } else if (selectedItem.kind === 'FLOOD') {
        coords = selectedItem.data.coordinates[0];
      }

      if (coords) {
        map.flyTo(coords, 15.5, {
          animate: true,
          duration: 1.0,
        });
      }
    }
  }, [focusTarget, selectedItem]);

  // Map Controls Helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    // Reset wyśrodkowany dokładnie na dolinie Wisłoka w Rzeszowie
    mapInstanceRef.current?.flyTo([50.0445, 22.0170], 14, {
      animate: true,
      duration: 1.0,
    });
  };

  const handleCenterOnDrone = () => {
    mapInstanceRef.current?.flyTo(drone.coordinates, 15.5, {
      animate: true,
      duration: 1.0,
    });
  };

  const handleCenterOnActiveAlert = () => {
    const targetAlert = alerts.find(a => a.severity === 'CRITICAL') || alerts[0];
    if (targetAlert) {
      onSelectItem({ kind: 'ALERT', data: targetAlert });
      mapInstanceRef.current?.flyTo(targetAlert.coordinates, 16, {
        animate: true,
        duration: 1.0,
      });
    }
  };

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden bg-[#0d1522]">
      {/* Kontener mapy Leaflet */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 bg-[#0d1522]" 
        style={mapStyle === 'OFFLINE' ? {
          backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(30, 41, 59, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        } : undefined}
      />

      {/* Subtelna pigułka statusowa informująca o trybie offline wyłącznie gdy jest aktywny */}
      {mapStyle === 'OFFLINE' ? (
        <div className="absolute top-16 right-12 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/90 border border-amber-500/60 backdrop-blur text-amber-200 font-mono text-[10px] shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>TRYB OFFLINE (LOKALNA BAZA WEKTOROWA GIS)</span>
        </div>
      ) : isAutoOffline ? (
        <div className="absolute top-16 right-12 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/90 border border-rose-500/60 backdrop-blur text-rose-200 font-mono text-[10px] shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <span>BRAK INTERNETU • PRZEŁĄCZONO NA LOKALNY GIS</span>
        </div>
      ) : null}

      {/* Kompaktowe Przyciski Sterowania Mapą (Prawy górny róg) */}
      <div className="absolute top-16 right-3 z-10 flex flex-col gap-1.5 select-none font-mono">
        <div className="bg-[#0b111e]/95 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-xl flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Przybliż (+)"
            aria-label="Przybliż"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border-b border-slate-800 pb-1"
            title="Oddal (-)"
            aria-label="Oddal"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition cursor-pointer"
            title="Resetuj widok na Rzeszów / dolinę Wisłoka"
            aria-label="Reset widoku"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCenterOnDrone}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition cursor-pointer"
            title="Wycentruj na dronie BIELIK-1"
            aria-label="Namierz drona"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCenterOnActiveAlert}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-300 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
            title="Wycentruj na krytycznym alercie"
            aria-label="Krytyczny alert"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Kontrolki warstw (Lewy górny róg - zoptymalizowany, kompaktowy panel) */}
      <div className="absolute top-16 left-3 z-10 flex flex-col gap-1.5 select-none font-mono">
        <div className="bg-[#0b111e]/95 backdrop-blur border border-slate-800 rounded-lg shadow-xl overflow-hidden transition-all duration-200">
          <button
            onClick={() => setIsLayersExpanded(!isLayersExpanded)}
            className="flex items-center justify-between gap-2 px-2.5 py-1.5 w-full hover:bg-slate-800/60 text-slate-300 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
            title="Kliknij, aby rozwinąć/zwinąć warstwy operacyjne"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Warstwy operacyjne</span>
            </div>
            {isLayersExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isLayersExpanded && (
            <div className="p-2 pt-0.5 border-t border-slate-800/80 space-y-1 text-[10px]">
              {/* 1. Obszary zalane */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                <input 
                  type="checkbox" 
                  checked={showFlood} 
                  onChange={(e) => setShowFlood(e.target.checked)} 
                  className="accent-cyan-500 rounded"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2 rounded-sm bg-sky-600/70 border border-sky-400 inline-block"></span>
                  Zalanie (Poligony)
                </span>
              </label>

              {/* 2. Drogi */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                <input 
                  type="checkbox" 
                  checked={showRoads} 
                  onChange={(e) => setShowRoads(e.target.checked)} 
                  className="accent-rose-500 rounded"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-rose-500 inline-block"></span>
                  Drogi (Przejezdność)
                </span>
              </label>

              {/* 3. Budynki */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                <input 
                  type="checkbox" 
                  checked={showBuildings} 
                  onChange={(e) => setShowBuildings(e.target.checked)} 
                  className="accent-amber-500 rounded"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-amber-500 inline-block"></span>
                  Budynki (Punkty)
                </span>
              </label>

              {/* 4. Detekcje Drona */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                <input 
                  type="checkbox" 
                  checked={showDetections} 
                  onChange={(e) => setShowDetections(e.target.checked)} 
                  className="accent-purple-500 rounded"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  Obserwacje drona
                </span>
              </label>

              {/* 5. Trasa i sektor drona */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white py-0.5">
                <input 
                  type="checkbox" 
                  checked={showFlightPlan} 
                  onChange={(e) => setShowFlightPlan(e.target.checked)} 
                  className="accent-cyan-400 rounded"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 border border-cyan-400 border-dashed inline-block"></span>
                  Trajektoria drona
                </span>
              </label>

              {/* 6. Dron FOV */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 text-[9px] pt-1 border-t border-slate-800/80">
                <input 
                  type="checkbox" 
                  checked={showDroneFov} 
                  onChange={(e) => setShowDroneFov(e.target.checked)} 
                  className="accent-cyan-500 rounded"
                />
                <span>Stożek kamery (FOV)</span>
              </label>
            </div>
          )}
        </div>

      </div>

      {/* Kompaktowa Legenda Sytuacyjna (Pasek dolny z lewej strony) */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-[#0a0f18]/90 backdrop-blur border border-slate-800/80 px-3 py-1.5 rounded-md text-[10px] font-mono text-slate-300 shadow-lg select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2 rounded-sm bg-sky-600/70 border border-sky-400"></span>
          <span>Zalanie</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-emerald-500"></span>
          <span>Przejezdna</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 border-b-2 border-dashed border-rose-500"></span>
          <span>Nieprzejezdna</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
          <span>Budynek zagrożony</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Obserwacja</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-cyan-300 font-bold">▲</span>
          <span>Dron</span>
        </div>
      </div>
    </div>
  );
};
