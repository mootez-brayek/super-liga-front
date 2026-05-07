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
  hasTeam = true;
  playerForm: Partial<CreatePlayerRequest> = {
    firstName: '',
    lastName: '',
    number: undefined,
    strongFoot: 'RIGHT',
    position: 'FORWARD',
    birthDate: '',
    picture: ''
  };

  createTeamModal = false;

  teamForm = {
    name: '',
    logo: ''
  };
  finishedMatches: MyMatchResultResponse[] = [];
  upcomingMatches: MatchResponse[] = [];

  addPlayerModal = false;

  constructor(private teamService: TeamService, private cdr:ChangeDetectorRef, private matchService: MatchService){}
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
  // Reset everything first (VERY IMPORTANT)
  this.hasTeam = true;
  this.team = undefined;
  this.stats = undefined;
  this.players = [];
  this.finishedMatches = [];
  this.upcomingMatches = [];

  this.teamService.getMyTeam().subscribe({
    next: (team) => {

      // 🚨 CASE: NO TEAM
      if (!team || !(team as any)?.teamId) {
        this.hasTeam = false;
        this.cdr.detectChanges();
        return;
      }

      // ✅ TEAM EXISTS
      this.hasTeam = true;
      this.team = team;

      const teamId = (team as any).teamId;

      // Load everything ONLY if team exists
      this.loadPlayers(teamId);
      this.loadMatches();
      this.loadStats();

      this.cdr.detectChanges();
    },

    error: () => {
      // 🚨 API error = treat as no team
      this.hasTeam = false;
      this.team = undefined;
      this.cdr.detectChanges();
    }
  });
}

loadStats() {
  this.teamService.getMyStats().subscribe({
    next: (stats) => {
      this.stats = stats;
      this.cdr.detectChanges();
    }
  });
}

loadMatches() {
  this.matchService.getMyFinishedMatches().subscribe(m => {
    this.finishedMatches = m;
    this.cdr.detectChanges();
  });

  this.matchService.getMyUpcomingMatches().subscribe(m => {
    this.upcomingMatches = m;
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

  openCreateTeam() {
    this.createTeamModal = true;
  }

closeCreateTeam() {
  this.createTeamModal = false;
}

submitCreateTeam() {
  if (!this.teamForm.name) {
    alert('Team name is required');
    return;
  }

  this.teamService.createTeam(this.teamForm).subscribe({
    next: () => {
      this.closeCreateTeam();
      this.loadData(); // reload dashboard
    },
    error: (err) => {
      console.error(err);
      alert('Failed to create team');
    }
  });
}
}
