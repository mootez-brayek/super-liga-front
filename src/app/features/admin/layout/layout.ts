import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamResponse } from '../../../shared/dto/team-response.dto';
import { StandingResponse } from '../../../shared/dto/standing-response.dto';
import { PlayerResponse } from '../../../shared/dto/player-response.dto';
import { TeamService } from '../../../core/services/team';
import { CreatePlayerRequest } from '../../../shared/dto/create-player-request.dto';
import { MatchResponse } from '../../../shared/dto/match-response.dto';
import { MatchService } from '../../../core/services/match-service';
import { MyMatchResultResponse } from '../../../shared/dto/my-match-response.dto';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit{
  team?: TeamResponse;
  stats?: StandingResponse;
  players: PlayerResponse[] = [];

  playerForm: Partial<CreatePlayerRequest> = {
    firstName: '',
    lastName: '',
    number: undefined,
    strongFoot: 'RIGHT',
    position: 'FORWARD',
    birthDate: '',
    picture: ''
  };

  finishedMatches: MyMatchResultResponse[] = [];
  upcomingMatches: MatchResponse[] = [];

  addPlayerModal = false;

  constructor(private teamService: TeamService, private cdr:ChangeDetectorRef, private matchService: MatchService){}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.teamService.getMyTeam().subscribe({
      next: (team) => {
        this.team = team;

        const teamId = (team as any)?.teamId ?? (team as any)?.id;

        if (!teamId) {
          console.error('No teamId found in response', team);
          return;
        }

        this.loadPlayers(teamId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('TEAM ERROR', err)
    });

    this.teamService.getMyStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log(stats);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('STATS ERROR', err)
    });

    this.matchService.getMyFinishedMatches().subscribe(matches => {
      this.finishedMatches = matches;
      console.log("result",matches);
      this.cdr.detectChanges();
    });

    this.matchService.getMyUpcomingMatches().subscribe(matches => {
      this.upcomingMatches = matches;
      this.cdr.detectChanges();
    });
  }

  submitAddPlayer() {

    if (
      !this.playerForm.firstName ||
      !this.playerForm.lastName ||
      this.playerForm.number == null ||
      !this.team
    ) {
      alert('Please fill required fields');
      return;
    }

    const payload: CreatePlayerRequest = {
      firstName: this.playerForm.firstName,
      lastName: this.playerForm.lastName,
      number: Number(this.playerForm.number),
      picture: this.playerForm.picture || '',
      strongFoot: this.playerForm.strongFoot!,
      birthDate: this.playerForm.birthDate!,
      position: this.playerForm.position!,
      teamId: this.team.teamId
    };

    this.teamService.addPlayer(payload).subscribe({
      next: () => {
          this.closeAddPlayer();
          this.loadPlayers(this.team!.teamId);
          this.playerForm = this.getEmptyForm();
          this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add player');
      }
    });
  }
  
  loadPlayers(teamId: number) {
    this.teamService.getPlayersByTeam(teamId).subscribe({
      next: (players) => {
        this.players = players ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('PLAYERS ERROR:', err);
        this.players = [];
        this.cdr.detectChanges();
      }
    });
  }

  openAddPlayer() {
    this.addPlayerModal = true;
  }

  closeAddPlayer() {
    this.addPlayerModal = false;
  }
  
    private getEmptyForm(): Partial<CreatePlayerRequest> {
    return {
      firstName: '',
      lastName: '',
      number: undefined,
      strongFoot: 'RIGHT',
      position: 'FORWARD',
      birthDate: '',
      picture: ''
    };
  }

  trackByPlayer(index: number, player: PlayerResponse) {
    return player.playerId;
  }
}
