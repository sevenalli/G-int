import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

// export interface Port {
//   portId: number;
//   name: string;
//   description: string;
//   location: string;
// }

// public class Engine {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long engineId;
//     private String code; // e.g., "bed78dc"
//     private String name;// e.g., "terex"
//     private String ipAddress; // e.g., "192.168.1.1"
//     private boolean isActive;
//     private String lastSeen; // ISO-8601 string
//     private String manufacturer;

//     @ManyToOne
//     @JoinColumn(name = "engine_type_id", nullable = false)
//     private EngineType engineType;
        
//     @ManyToOne
//     @JoinColumn(name = "terminal_id", nullable = false)
//     private Terminal terminal;

//     @ManyToOne
//     @JoinColumn(name = "port_id", nullable = false)
//     private Port port;

// }

// cranes = [
//     {
//       id: 'G380003',
//       notifications: 0,
//       craneType :'G38',
//       hookType: 'Crochet',
//       status1: 'AFFECTE',
//       status2: 'DRIVE',
//       power: 'ON',
//       hours: '43 889 H',
//       extra: 'EXTRA 1',
//       route: '/supervisionCranes'
//     },

export interface Engine {
  engineId: number;
  code: string; // e.g., "bed78dc"
  name: string; // e.g., "terex"
  ipAddress: string; // e.g., "192.168.1.1"
  active: boolean;
  lastSeen: string; // ISO-8601 string
  manufacturer: string;
  engineTypeId: number; // ID of the engine type
  terminalId: number; // ID of the terminal
  portId: number; // ID of the port
  icon?: string; // Optional icon property, can be used for display purposes
  hours: number
  extra?: string; // Optional extra information
  route?: string; // e.g., '/supervisionCranes'
  notificationCount?: number; // Can be a number or 'M' for maintenance
}

@Injectable({
  providedIn: 'root'
})
export class EnginesService {
  private apiUrl = 'http://localhost:8080/api/v1/engines';
  private sseUrl = 'http://localhost:8080/engines-sse';

  constructor(private http: HttpClient) {}

  getEngines(): Observable<Engine[]> {
    return this.http.get<Engine[]>(this.apiUrl);
  }

  //postgresql
  getEnginesByCriteria(terminalIds: string[], equipmentIds: string[]): Observable<Engine[]> {
    let params = new HttpParams();
    terminalIds.forEach(id => {
      params = params.append('terminalIds', id);
    });
    equipmentIds.forEach(id => {
      params = params.append('engineTypeIds', id); // Changed from 'equipmentIds'
    });
    return this.http.get<Engine[]>(`${this.apiUrl}/terminal-engine-type`, { params });
  }

  // influxdb sse
  subscribeToEngineUpdates(terminalIds: string[] = [], engineTypeIds: string[] = []): EventSource {
    let queryParams = new HttpParams();
    if (terminalIds.length || engineTypeIds.length) {
      terminalIds.forEach(id => {
        queryParams = queryParams.append('terminalIds', id);
      });
      engineTypeIds.forEach(id => {
        queryParams = queryParams.append('engineTypeIds', id);
      });
    }
    if(queryParams) queryParams = queryParams.append(`sseApiKey`, environment.apiKey);


    //event source does not go through Angular’s interceptors like HttpClient, so no headers are attached
    return new EventSource(`${this.sseUrl}?${queryParams}`);
  }
}
