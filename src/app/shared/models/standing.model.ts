export interface Standing {
  teamId?: number;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  position: number;
  losses: number;
  points: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
}