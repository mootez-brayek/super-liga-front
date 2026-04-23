import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Standing } from '../../shared/models/standing.model';
import { MatchResponse } from '../../shared/dto/match-response.dto';
import { MatchResultResponse } from '../../shared/dto/match-result.dto';
import { TeamResponse } from '../../shared/dto/team-response.dto';
import { PlayerResponse } from '../../shared/dto/player-response.dto';

@Injectable({
  providedIn: 'root',
})
export class PublicService {

  constructor(private api: ApiService) {}

      getStandings() {
        return this.api.get<Standing[]>('api/public/standing');
      }

      getUpcomingMatches(){
        return this.api.get<MatchResponse[]>('api/public/match/upcoming');
      }

      getfinishedMatches(){
        return this.api.get<MatchResultResponse[]>('api/public/match/finished');
      }

      getTeams(){
        return this.api.get<TeamResponse[]>('api/public/teams');
      }

      getPlayersByTeam(teamId: number){
        return this.api.get<PlayerResponse[]>(`api/public/players/${teamId}`);
      }
  
}
