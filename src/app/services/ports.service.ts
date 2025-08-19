import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Port {
  portId: number;
  name: string;
  description: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortsService {
  private apiUrl = 'http://localhost:8080/api/v1/ports';

  constructor(private http: HttpClient) {}

  getPorts(): Observable<Port[]> {
    return this.http.get<Port[]>(this.apiUrl);
  }
}
