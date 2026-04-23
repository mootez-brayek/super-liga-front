import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../core/services/team';
import { TeamResponse } from '../../../shared/dto/team-response.dto';
import { PlayerResponse } from '../../../shared/dto/player-response.dto';

@Component({
  selector: 'app-team',
  imports: [CommonModule, FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})

export class Team implements OnInit{

  teams: TeamResponse[] = [];
  loading = false;
  error = '';

  players: PlayerResponse[] = [];
  selectedTeamName = '';
  playersModal = false;
  loadingPlayers = false;

  constructor(private teamService: TeamService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadTeams();
  }

    loadTeams() {
    this.loading = true;
    this.error = '';

    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.teams = res ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load teams';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

openTeamPlayers(team: any) {
  // 1. RESET EVERYTHING FIRST
  this.players = [];
  this.selectedTeamName = team.name;
  this.loadingPlayers = true;
  this.playersModal = true;

  // 2. CALL API
  this.teamService.getPlayersByTeam(team.teamId).subscribe({
    next: (res) => {
      this.players = res ?? [];
      this.loadingPlayers = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.players = [];
      this.loadingPlayers = false;
      this.playersModal = false;
      this.cdr.detectChanges(); // close modal on error
    }
  });
}
}
