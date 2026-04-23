export interface CreatePlayerRequest {
  firstName: string;
  lastName: string;
  number: number;
  picture?: string;
  strongFoot: 'RIGHT' | 'LEFT' | 'BOTH';
  birthDate: string; // ISO string (yyyy-MM-dd)
  position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
  teamId: number;
}