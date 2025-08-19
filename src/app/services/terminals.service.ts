import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Terminal {
  categories: any;
  terminalId: number;
  name: string;
  location: string;
  portId: number; // Assuming terminals are associated with a port
  portName: string; // Name of the port for display purposes
}

@Injectable({
  providedIn: 'root'
})
export class TerminalsService {
  private apiUrl = 'http://localhost:8080/api/v1/terminals';

  constructor(private http: HttpClient) {}

  getTerminals(): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(this.apiUrl);
  }

  getTerminalsByPort(portId: number): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(`${this.apiUrl}/port/${portId}`);
  }
}
