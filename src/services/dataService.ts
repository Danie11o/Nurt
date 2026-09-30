import { 
  FloodArea, 
  RoadFeature, 
  BuildingFeature, 
  DroneDetectionPoint, 
  TimeStep, 
  AlertIncident,
  FlightDiffReport 
} from '../types';
import { 
  SITUATIONAL_FLOOD_AREAS, 
  getRoadsForTimeStep, 
  getBuildingsForTimeStep, 
  getDroneDetectionsForTimeStep,
  FLIGHT_DIFF_REPORTS 
} from '../data/situationalData';
import { ALL_ALERTS } from '../data/mockData';

/**
 * SERWIS DANYCH OPERACYJNYCH RESQGRID
 * 
 * Przygotowany jako warstwa abstrakcji API.
 * W wersji demonstracyjnej dostarcza deterministyczne snapshoty przelotów drona.
 * W wersji produkcyjnej wystarczy podmienić implementację metod na wywołania fetch('/api/v1/...') lub WebSocket.
 */
export class FloodDataService {
  /**
   * Pobiera poligony obszarów zalanych dla danego kroku czasowego
   */
  public static async getFloodAreas(timeStep: TimeStep): Promise<FloodArea[]> {
    return Promise.resolve(SITUATIONAL_FLOOD_AREAS[timeStep] || []);
  }

  /**
   * Pobiera sieć drogową wraz ze statusem przejezdności dla wybranego snapshotu przelotu
   */
  public static async getRoads(timeStep: TimeStep): Promise<RoadFeature[]> {
    return Promise.resolve(getRoadsForTimeStep(timeStep));
  }

  /**
   * Pobiera rejestr budynków i obiektów infrastruktury dla wybranego snapshotu przelotu
   */
  public static async getBuildings(timeStep: TimeStep): Promise<BuildingFeature[]> {
    return Promise.resolve(getBuildingsForTimeStep(timeStep));
  }

  /**
   * Pobiera punkty detekcji dronowych (osoby, pojazdy, zatory, uszkodzenia) dla wybranego przelotu
   */
  public static async getDroneDetections(timeStep: TimeStep): Promise<DroneDetectionPoint[]> {
    return Promise.resolve(getDroneDetectionsForTimeStep(timeStep));
  }

  /**
   * Pobiera raport różnicowy "CHANGES SINCE LAST FLIGHT" dla danego przelotu
   */
  public static async getFlightDiff(timeStep: TimeStep): Promise<FlightDiffReport> {
    return Promise.resolve(FLIGHT_DIFF_REPORTS[timeStep]);
  }

  /**
   * Pobiera listę priorytetów i alertów operacyjnych
   */
  public static async getAlerts(): Promise<AlertIncident[]> {
    return Promise.resolve(ALL_ALERTS);
  }

  /**
   * Zmiana statusu dyspozycji zadania (zatwierdzenie przez dowódcę sztabu)
   */
  public static async dispatchAction(_entityId: string, _entityType: 'ALERT' | 'DETECTION' | 'BUILDING' | 'ROAD'): Promise<boolean> {
    return Promise.resolve(true);
  }
}
