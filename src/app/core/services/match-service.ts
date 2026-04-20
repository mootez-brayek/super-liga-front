import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { MatchResultResponse } from '../../shared/dto/match-result.dto';

@Injectable({
  providedIn: 'root',
})
export class MatchService {


  constructor(private api: ApiService) {}
  
  getMatchResult(matchId: number) {
    return this.api.get<MatchResultResponse>(`api/super-admin/matches/${matchId}/result`);
  }
}
