import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { TeamResponse } from '../../shared/dto/team-response.dto';
import { PlayerResponse } from '../../shared/dto/player-response.dto';
import { StandingResponse } from '../../shared/dto/standing-response.dto';
import { CreatePlayerRequest } from '../../shared/dto/create-player-request.dto';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private api: ApiService) {}
  
    getTeams(): Observable<TeamResponse[]> {
      return this.api.get<TeamResponse[]>('api/team');
    }

    getPlayersByTeam(teamId: number) {
      return this.api.get<PlayerResponse[]>(`api/admin/player/team/${teamId}`);
    }

    getMyTeam() {
      return this.api.get<TeamResponse>('api/admin/my-team');
    }

    getMyStats() {
      return this.api.get<StandingResponse>('api/admin/my-stats');
    }

    addPlayer(payload: CreatePlayerRequest) {
      return this.api.post<PlayerResponse>('api/admin/player', payload);
    }

    createTeam(payload: { name: string; logo: string }) {
      return this.api.post<TeamResponse>(
        'api/team/create-team',
        payload
      );
    }
}
