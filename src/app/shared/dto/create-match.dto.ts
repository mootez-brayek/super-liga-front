export interface CreateMatchDTO {
  homeTeamId: number | null;
  awayTeamId: number | null;
  matchDate: string; // '2026-04-20'
  matchTime: string; // '18:30'
}