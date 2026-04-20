import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Standing } from '../../shared/models/standing.model';

@Injectable({
  providedIn: 'root',
})
export class StandingService {

    constructor(private api: ApiService) {}

    getStandings() {
      return this.api.get<Standing[]>('api/standing');
    }
  
}
