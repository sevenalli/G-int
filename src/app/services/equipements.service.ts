import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './categories.service';

export interface Equipment {
  engineTypeId: number;
  name: string;
  family: string;
  model: string;
  categoryId: number; // Assuming the backend returns a categoryId
  icon?: string; // Optional icon property, can be used for display purposes
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:8080/api/v1/engine-types';

  constructor(private http: HttpClient) {}

  // Calls the new backend endpoint
  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}`);
  }
}