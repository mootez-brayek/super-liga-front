export interface Match {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  scoreHome?: number;
  scoreAway?: number;
  matchTime: string;
  matchDate: string;
  date: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED' | 'CANCELED';

  homeTeamId: number;   // ✅ ADD THIS
  awayTeamId: number; 
}