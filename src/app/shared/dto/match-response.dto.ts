export interface MatchResponse {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  matchTime: string;
  homeScore?: number;
  awayScore?: number;

  status: string;
}