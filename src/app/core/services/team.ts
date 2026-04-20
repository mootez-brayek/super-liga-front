import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { TeamResponse } from '../../shared/dto/team-response.dto';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private api: ApiService) {}
  
    getTeams(): Observable<TeamResponse[]> {
      return this.api.get<TeamResponse[]>('api/team');
    }

    getPlayersByTeam(teamId: number) {
      return this.api.get<any[]>(`api/admin/player/team/${teamId}`);
    }
}
