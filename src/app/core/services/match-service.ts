import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { MatchResultResponse } from '../../shared/dto/match-result.dto';
import { MyMatchResultResponse } from '../../shared/dto/my-match-response.dto';

@Injectable({
  providedIn: 'root',
})
export class MatchService {


  constructor(private api: ApiService) {}
  
  getMatchResult(matchId: number) {
    return this.api.get<MatchResultResponse>(`api/super-admin/matches/${matchId}/result`);
  }

  getMyFinishedMatches() {
    return this.api.get<MyMatchResultResponse[]>(`api/super-admin/matches/my-finished`);
  }

  getMyUpcomingMatches() {
    return this.api.get<MyMatchResultResponse[]>(`api/super-admin/matches/my-upcoming`);
  }
}
