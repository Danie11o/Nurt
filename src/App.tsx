import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { MapComponent } from './components/MapComponent';
import { TimelineBar } from './components/TimelineBar';
import { FlightDiffBanner } from './components/FlightDiffBanner';
import { AlertDetailModal } from './components/AlertDetailModal';
import { DataAnalysisModal } from './components/DataAnalysisModal';
import { SitrepModal } from './components/SitrepModal';
import { MapDetailDrawer } from './components/MapDetailDrawer';
import { DemoController } from './components/DemoController';
import { WorkspaceToolbar, WorkspacePanel } from './components/WorkspaceToolbar';
import { DemoGuidanceCard } from './components/DemoGuidanceCard';
import { Radio, X } from 'lucide-react';
import { 
  ALL_ALERTS, 
  INITIAL_DRONE_MISSION, 
  PUBLIC_DATA_SOURCES, 
  TIMESTEP_DATA,
  INITIAL_RESOURCES 
} from './data/mockData';
import { FloodDataService } from './services/dataService';
import { 
  AlertIncident, 
  TimeStep, 
  MapSelectedItem, 
  RoadFeature, 
  BuildingFeature, 
  DroneDetectionPoint,
  DroneMission,
  OperationalProfile,
  OperationalResource,
  RetaskTarget
} from './types';

export function App() {
  const [activeTimeStep, setActiveTimeStep] = useState<TimeStep>('12:00');
  const [profile, setProfile] = useState<OperationalProfile>('CIVIL');
  const [resourcesState, setResourcesState] = useState<OperationalResource[]>(INITIAL_RESOURCES);
  const [retaskTarget, setRetaskTarget] = useState<RetaskTarget | null>(null);
  const [retaskBanner, setRetaskBanner] = useState<{ show: boolean; leaving: boolean }>({ show: false, leaving: false });
  const retaskTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [focusTarget, setFocusTarget] = useState<{ coords: [number, number]; zoom?: number; id?: string; timestamp: number } | null>(null);

  const [alertsState, setAlertsState] = useState<AlertIncident[]>(ALL_ALERTS);
  const [roadsState, setRoadsState] = useState<RoadFeature[]>([]);
  const [buildingsState, setBuildingsState] = useState<BuildingFeature[]>([]);
  const [detectionsState, setDetectionsState] = useState<DroneDetectionPoint[]>([]);
  
  // Zaznaczony obiekt na mapie (Inspektor Drawer)
  const [selectedMapItem, setSelectedMapItem] = useState<MapSelectedItem | null>(null);
  
  // Modal szczegółowego widoku alertu
  const [detailedAlert, setDetailedAlert] = useState<AlertIncident | null>(null);

  // Modal analizy danych z drona (Pipeline)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isSitrepOpen, setIsSitrepOpen] = useState(false);
  const [workspacePanel, setWorkspacePanel] = useState<WorkspacePanel>(null);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(true);

  // DEMO MODE: 8 ręcznie zatwierdzanych kroków — bez automatycznego przeskakiwania.
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);


  // Dynamiczne ładowanie snapshotu przelotu w zależności od wybranego kroku czasowego
  useEffect(() => {
    async function loadSnapshotData() {
      const [roads, buildings, detections, alerts] = await Promise.all([
        FloodDataService.getRoads(activeTimeStep),
        FloodDataService.getBuildings(activeTimeStep),
        FloodDataService.getDroneDetections(activeTimeStep),
        FloodDataService.getAlerts(),
      ]);
      setRoadsState(roads);
      setBuildingsState(buildings);
      setDetectionsState(detections);
      setAlertsState(alerts);
    }
    loadSnapshotData();
  }, [activeTimeStep]);

  // Filtrowanie alertów widocznych w danym kroku czasowym
  const visibleAlerts = useMemo(() => {
    const timeOrder: Record<TimeStep, number> = {
      '12:00': 1,
      '12:15': 2,
      '12:30': 3,
      '12:45': 4,
    };
    const currentOrder = timeOrder[activeTimeStep];
    return alertsState.filter(a => timeOrder[a.timeStep] <= currentOrder);
  }, [alertsState, activeTimeStep]);

  // Telemetria drona dla wybranego czasu
  // Telemetria drona dla wybranego czasu (wszystkie parametry dynamiczne zależne od timestepu)
  const currentDroneMission: DroneMission = useMemo(() => {
    const stepInfo = TIMESTEP_DATA[activeTimeStep];
    return {
      ...INITIAL_DRONE_MISSION,
      battery: stepInfo.battery,
      coordinates: stepInfo.droneCoords,
      coveragePercent: stepInfo.coveragePercent,
      missionProgressPercent: stepInfo.missionProgressPercent,
      capturedFramesCount: stepInfo.capturedFramesCount,
      lastDataUpload: stepInfo.lastDataUpload,
      currentStage: stepInfo.currentStage,
      status: (retaskTarget ? 'RE-TASKED / ZADANIOWANO' : stepInfo.missionStatus) as DroneMission['status'],
    };
  }, [activeTimeStep, retaskTarget]);

  // Licznik alertów krytycznych
  const criticalCount = useMemo(() => {
    return visibleAlerts.filter(a => a.severity === 'CRITICAL').length;
  }, [visibleAlerts]);

  // Obsługa kliknięcia alertu z prawego panelu -> Otwiera pełny widok szczegółowy alertu
  const handleSelectAlert = (alert: AlertIncident) => {
    setDetailedAlert(alert);
    setSelectedMapItem({ kind: 'ALERT', data: alert });
  };

  // Akcja: Mark as acknowledged
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlertsState(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          isAcknowledged: true,
        };
      }
      return a;
    }));
    if (detailedAlert && detailedAlert.id === alertId) {
      setDetailedAlert(prev => prev ? { ...prev, isAcknowledged: true } : null);
    }
  };

  // JEDNOLITY MECHANIZM DYSPOZYCJI ZASOBÓW (RightPanel + AlertDetailModal + Drawer)
  const handleDispatchAlert = (alertId: string, customTeamName?: string) => {
    const alert = alertsState.find(a => a.id === alertId);
    if (!alert) return;

    // Blokada double-dispatch: jeśli już zadysponowano, nie odliczaj ponownie
    if (alert.status === 'DISPATCHED' || alert.operatorDecision === 'DISPATCHED') {
      return;
    }

    // Wyznaczenie typu zasobu
    let resType: 'AMPHIBIOUS' | 'BOAT' | 'TEAM' = 'TEAM';
    if (customTeamName) {
      if (customTeamName.includes('PTS-M') || customTeamName.includes('Amfibia')) {
        resType = 'AMPHIBIOUS';
      } else if (customTeamName.includes('Wodnego') || customTeamName.includes('Łódź')) {
        resType = 'BOAT';
      }
    } else {
      if (alert.category === 'BUILDING' || alert.title.toLowerCase().includes('odcięci') || alert.title.toLowerCase().includes('ludzi')) {
        resType = 'AMPHIBIOUS';
      } else if (alert.category === 'FLOOD_SURGE' || alert.title.toLowerCase().includes('zalani')) {
        resType = 'BOAT';
      }
    }

    // Sprawdzenie dostępności w sztabie
    const targetRes = resourcesState.find(r => r.type === resType);
    if (!targetRes || targetRes.available <= 0) {
      return; // blokada braku sił
    }

    // Zmniejszenie available o 1, zwiększenie inAction o 1
    setResourcesState(prev => prev.map(r => {
      if (r.type === resType) {
        return {
          ...r,
          available: Math.max(0, r.available - 1),
          inAction: r.inAction + 1,
        };
      }
      return r;
    }));

    const resolvedTeam = customTeamName || (
      resType === 'AMPHIBIOUS'
        ? 'Pojazd terenowy partnera operacyjnego'
        : resType === 'BOAT'
        ? 'Sekcja Ratownictwa Wodnego (Łodzie OSP)'
        : 'Zastęp GBARt PSP JRG-1 Rzeszów'
    );

    setAlertsState(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          assignedTeam: resolvedTeam,
          status: 'DISPATCHED',
          operatorDecision: 'DISPATCHED',
          isAcknowledged: true,
        };
      }
      return a;
    }));

    if (detailedAlert && detailedAlert.id === alertId) {
      setDetailedAlert(prev => prev ? {
        ...prev,
        assignedTeam: resolvedTeam,
        status: 'DISPATCHED',
        operatorDecision: 'DISPATCHED',
        isAcknowledged: true,
      } : null);
    }
  };

  // Akcja: Show on map (zamyka modal i płynnie centruje mapę flyTo)
  const handleShowOnMap = (alert: AlertIncident) => {
    setDetailedAlert(null); // Zamknij modal, aby użytkownik widział mapę
    setSelectedMapItem({ kind: 'ALERT', data: alert });
    setFocusTarget({
      coords: alert.coordinates,
      zoom: 15.2,
      id: alert.id,
      timestamp: Date.now(),
    });
  };

  // Akcja: Namierz drona (płynny flyTo na koordynaty drona)
  const handleLocateDrone = () => {
    setSelectedMapItem(null);
    setFocusTarget({
      coords: currentDroneMission.coordinates,
      zoom: 15.5,
      timestamp: Date.now(),
    });
  };

  // Akcja: Przekieruj drona (Re-task sensor na koordynaty alertu)
  const handleRetaskDrone = (alert: AlertIncident) => {
    const target: RetaskTarget = {
      alertId: alert.id,
      coords: alert.coordinates,
      title: `${alert.title} (${alert.location})`,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    };
    setRetaskTarget(target);
    setRetaskBanner({ show: true, leaving: false });

    if (retaskTimeoutRef.current) {
      clearTimeout(retaskTimeoutRef.current);
    }
    retaskTimeoutRef.current = setTimeout(() => {
      closeRetaskBanner();
    }, 4000);

    setFocusTarget({
      coords: alert.coordinates,
      zoom: 16,
      id: alert.id,
      timestamp: Date.now(),
    });
  };

  const closeRetaskBanner = () => {
    if (retaskTimeoutRef.current) {
      clearTimeout(retaskTimeoutRef.current);
      retaskTimeoutRef.current = null;
    }
    setRetaskBanner(prev => ({ ...prev, leaving: true }));
    setTimeout(() => {
      setRetaskBanner({ show: false, leaving: false });
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (retaskTimeoutRef.current) clearTimeout(retaskTimeoutRef.current);
    };
  }, []);

  // Zatwierdzenie dyspozycji sił i środków (dla drawera szczegółów mapy)
  const handleMapDetailDispatch = (entityId: string, entityKind: string = 'ALERT') => {
    if (entityKind === 'ALERT') {
      handleDispatchAlert(entityId);
    } else {
      FloodDataService.dispatchAction(entityId, entityKind as any);
      setDetectionsState(prev => prev.map(d => {
        if (d.id === entityId) {
          return {
            ...d,
            status: 'ZADYSPONOWANO',
          };
        }
        return d;
      }));
    }
  };

  // Odrzucenie alertu
  const handleRejectAction = (entityId: string) => {
    setAlertsState(prev => prev.map(a => {
      if (a.id === entityId) {
        return {
          ...a,
          status: 'REJECTED',
          operatorDecision: 'REJECTED',
        };
      }
      return a;
    }));
  };

  // Reakcja na zmianę kroku demonstracyjnego
  useEffect(() => {
    if (!isDemoActive) return;
    setIsDemoGuideOpen(true);

    switch (demoStepIndex) {
      case 0: // 1. pokazuje początkową sytuację 12:00
        setActiveTimeStep('12:00');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      case 1: // 2. rozpoczyna się misja drona
        setActiveTimeStep('12:15');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      case 2: // 3. symulowany jest upload danych
        setActiveTimeStep('12:15');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      case 3: // 4. pojawia się analiza
        setActiveTimeStep('12:15');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      case 4: // 5. mapa aktualizuje zasięg powodzi
        setActiveTimeStep('12:30');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      case 5: // 6. generowane są alerty
        setActiveTimeStep('12:30');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      case 6: // 7. decyzja człowieka na podstawie alertu
        setActiveTimeStep('12:30');
        {
          const crit = alertsState.find(a => a.severity === 'CRITICAL') || ALL_ALERTS[0];
          setSelectedMapItem(null);
          setDetailedAlert(null);
          setIsAnalysisOpen(false);
          setFocusTarget({
            coords: crit.coordinates,
            zoom: 16,
            id: crit.id,
            timestamp: Date.now(),
          });
        }
        break;

      case 7: // 8. ponowny lot zamyka pętlę weryfikacji
        setActiveTimeStep('12:45');
        setSelectedMapItem(null);
        setDetailedAlert(null);
        setIsAnalysisOpen(false);
        break;

      default:
        break;
    }
  }, [demoStepIndex, isDemoActive, alertsState]);

  const handleStartDemo = () => {
    setIsDemoActive(true);
    setIsDemoGuideOpen(true);
    setDemoStepIndex(0);
    setActiveTimeStep('12:00');
    if (retaskTimeoutRef.current) {
      clearTimeout(retaskTimeoutRef.current);
      retaskTimeoutRef.current = null;
    }
    setRetaskBanner({ show: false, leaving: false });
    setRetaskTarget(null);
    setFocusTarget(null);
    setSelectedMapItem(null);
    setDetailedAlert(null);
    setIsAnalysisOpen(false);
    setIsSitrepOpen(false);
    setWorkspacePanel(null);
  };

  const handleStopDemo = () => {
    setIsDemoActive(false);
    setDemoStepIndex(0);
    setActiveTimeStep('12:00');
    if (retaskTimeoutRef.current) {
      clearTimeout(retaskTimeoutRef.current);
      retaskTimeoutRef.current = null;
    }
    setRetaskBanner({ show: false, leaving: false });
    setRetaskTarget(null);
    setFocusTarget(null);
    setSelectedMapItem(null);
    setDetailedAlert(null);
    setIsAnalysisOpen(false);
    setIsSitrepOpen(false);
    setWorkspacePanel(null);
  };

  const handleNextStep = () => {
    if (demoStepIndex < 7) {
      setDemoStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (demoStepIndex > 0) {
      setDemoStepIndex(prev => prev - 1);
    }
  };

  const handleFinishDemo = () => {
    setIsDemoActive(false);
    setIsDemoGuideOpen(false);
    setWorkspacePanel(null);
    setSelectedMapItem(null);
  };

  const handleSelectStep = (index: number) => {
    setDemoStepIndex(index);
  };

  // Reset scenariusza
  const handleReset = () => {
    setIsDemoActive(false);
    setDemoStepIndex(0);
    setActiveTimeStep('12:00');
    setAlertsState(ALL_ALERTS);
    setResourcesState(INITIAL_RESOURCES);
    if (retaskTimeoutRef.current) {
      clearTimeout(retaskTimeoutRef.current);
      retaskTimeoutRef.current = null;
    }
    setRetaskBanner({ show: false, leaving: false });
    setRetaskTarget(null);
    setFocusTarget(null);
    setSelectedMapItem(null);
    setDetailedAlert(null);
    setIsAnalysisOpen(false);
    setIsSitrepOpen(false);
    setWorkspacePanel(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080c14] text-slate-100 font-sans select-none">
      {/* 4. Górny pasek C2 */}
      <Header
        drone={currentDroneMission}
        activeTimeStep={activeTimeStep}
        onReset={handleReset}
        onOpenReport={() => setIsSitrepOpen(true)}
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
        criticalAlertsCount={criticalCount}
        isDemoActive={isDemoActive}
        onStartDemo={handleStartDemo}
        profile={profile}
        onToggleProfile={setProfile}
      />

      {/* Pasek sterowania trybem DEMO MODE (dla prezentacji przed Jury) */}
      <DemoController
        isDemoActive={isDemoActive}
        currentStepIndex={demoStepIndex}
        onStopDemo={handleStopDemo}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onSelectStep={handleSelectStep}
        onFinishDemo={handleFinishDemo}
      />

      {/* Główna sekcja operacyjna */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. Środek: Duża interaktywna mapa + wielowarstwowa sytuacja powodziowa */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <WorkspaceToolbar
            activePanel={workspacePanel}
            onTogglePanel={(panel) => setWorkspacePanel(current => current === panel ? null : panel)}
            mission={currentDroneMission}
            activeTimeStep={activeTimeStep}
            criticalCount={criticalCount}
            isInspectorOpen={selectedMapItem !== null}
          />

          {isDemoActive && isDemoGuideOpen && (
            <DemoGuidanceCard
              stepIndex={demoStepIndex}
              onClose={() => setIsDemoGuideOpen(false)}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
              onFinish={handleFinishDemo}
            />
          )}
          {/* Status Zadaniowania Drona (Re-tasked banner - auto-hide po ~4s, przycisk X, animacja fade) */}
          {retaskTarget && retaskBanner.show && (
            <div
              className={`absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-slate-950/95 border-2 border-amber-500/80 rounded-lg p-2.5 pl-4 pr-2.5 shadow-2xl backdrop-blur flex items-center gap-3 font-mono transition-all duration-300 ${
                retaskBanner.leaving ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0 animate-fadeIn'
              }`}
            >
              <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Radio className="w-4 h-4 animate-pulse text-amber-400" />
              </div>
              <div className="flex flex-col">
                <div className="text-[10px] text-amber-400 tracking-wider font-bold uppercase">
                  SENSOR REDIRECTED FOR VERIFICATION
                </div>
                <div className="text-xs text-white font-bold">
                  Dron przekierowany nad cel: <span className="text-amber-300">{retaskTarget.title}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeRetaskBanner}
                className="ml-2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Zamknij powiadomienie"
                aria-label="Zamknij"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Nakładki statusowe Demo Mode podczas transmisji danych, analizy i wykrycia alertu krytycznego */}
          <MapComponent
            alerts={visibleAlerts}
            roads={roadsState}
            buildings={buildingsState}
            droneDetections={detectionsState}
            selectedItem={selectedMapItem}
            onSelectItem={setSelectedMapItem}
            activeTimeStep={activeTimeStep}
            drone={currentDroneMission}
            onInspectDroneModal={(alert) => setDetailedAlert(alert)}
            focusTarget={focusTarget}
            retaskTarget={retaskTarget}
          />

          {/* Wysuwany Inspektor Szczegółów Obiektu Mapy (Droga, Budynek, Detekcja Drona, Woda) */}
          <MapDetailDrawer
            selectedItem={selectedMapItem}
            onClose={() => setSelectedMapItem(null)}
            onDispatch={handleMapDetailDispatch}
          />

          {/* 5. Pasek Timeline na dole mapy */}
          <TimelineBar
            activeTimeStep={activeTimeStep}
            onChangeTimeStep={setActiveTimeStep}
            isDemoActive={isDemoActive}
            demoStepIndex={demoStepIndex}
            onStartDemo={handleStartDemo}
          />
        </main>

        {/* Informacje drugiego poziomu: otwierane świadomie, bez stałego zasłaniania mapy. */}
        {workspacePanel && (
          <div
            className="absolute inset-0 z-[750] bg-slate-950/45 backdrop-blur-[1px] animate-fadeIn"
            onClick={() => setWorkspacePanel(null)}
          >
            {workspacePanel === 'MISSION' && (
              <div className="h-full w-fit max-w-[92vw] shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <LeftPanel
                  mission={currentDroneMission}
                  publicSources={PUBLIC_DATA_SOURCES}
                  activeTimeStep={activeTimeStep}
                  onLocateDrone={() => { handleLocateDrone(); setWorkspacePanel(null); }}
                  resources={resourcesState}
                  retaskTarget={retaskTarget}
                />
              </div>
            )}

            {workspacePanel === 'PRIORITIES' && (
              <div className="ml-auto h-full w-fit max-w-[96vw] shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <RightPanel
                  alerts={visibleAlerts}
                  selectedAlertId={selectedMapItem?.kind === 'ALERT' ? selectedMapItem.data.id : null}
                  onSelectAlert={(alert) => { handleSelectAlert(alert); setWorkspacePanel(null); }}
                  onDispatchAction={(id) => handleDispatchAlert(id)}
                  onRejectAction={handleRejectAction}
                  onShowOnMap={(alert) => { handleShowOnMap(alert); setWorkspacePanel(null); }}
                  profile={profile}
                  resources={resourcesState}
                />
              </div>
            )}

            {workspacePanel === 'CHANGES' && (
              <div className="absolute left-3 right-3 top-20 max-h-[calc(100%-6rem)] overflow-y-auto rounded-xl border border-cyan-500/30 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <FlightDiffBanner activeTimeStep={activeTimeStep} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* WIDOK SZCZEGÓŁOWY ALERTU (WHY THIS MATTERS, RECOMMENDED ACTION, ACTIONS) */}
      <AlertDetailModal
        alert={detailedAlert}
        onClose={() => setDetailedAlert(null)}
        onAcknowledge={handleAcknowledgeAlert}
        onAssignTeam={(alertId, teamName) => handleDispatchAlert(alertId, teamName)}
        onShowOnMap={handleShowOnMap}
        onRetaskDrone={handleRetaskDrone}
        isRetasked={retaskTarget?.alertId === detailedAlert?.id}
        resources={resourcesState}
        profile={profile}
      />

      {/* Modal raportu sytuacyjnego SITREP (do druku / prezentacji) */}
      <SitrepModal
        isOpen={isSitrepOpen}
        onClose={() => setIsSitrepOpen(false)}
        alerts={visibleAlerts}
        drone={currentDroneMission}
        activeTimeStep={activeTimeStep}
        profile={profile}
      />

      {/* Ekran/komponent analizy danych z drona (Data Analysis Pipeline) */}
      <DataAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        activeTimeStep={activeTimeStep}
      />
    </div>
  );
}

export default App;
