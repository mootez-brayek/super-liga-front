import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Match } from '../../../shared/models/match.model';
import { CreateMatchDTO } from '../../../shared/dto/create-match.dto';
import { SuperAdminService } from '../../../core/services/super-admin';
import { TeamResponse } from '../../../shared/dto/team-response.dto';
import { TeamService } from '../../../core/services/team';
import { MatchService } from '../../../core/services/match-service';
import { MatchResultResponse } from '../../../shared/dto/match-result.dto';

@Component({
  selector: 'app-matches',
  imports: [CommonModule, FormsModule],
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches implements OnInit{

  matches: Match[] = [];
  filteredMatches: Match[] = [];
  filter: 'ALL' | 'UPCOMING' | 'FINISHED' = 'ALL';
  loading = false;
  error = '';

  selectedResult?: any;
  resultModal = false;
  showModal = false;
  loadingResult = false;

  newMatch: CreateMatchDTO = {
    homeTeamId: null,
    awayTeamId: null,
    matchDate: '',
    matchTime: ''
  };

  finishModal = false;
  selectedMatch?: Match;

  finishForm = {
    homeScore: null as number | null,
    awayScore: null as number | null,
    homeRed: null as number | null,
    awayRed: null as number | null,

    homeOut: null as number | null,
    awayOut: null as number | null,
    mvpId: null as number | null
  };

  teams: TeamResponse[] = [];

  constructor(private service: SuperAdminService, private matchService: MatchService, private cdr: ChangeDetectorRef, private teamService: TeamService){}

  ngOnInit(): void {
    this.loadMatches();
     this.loadTeams();
  }

  applyFilter() {
    if (this.filter === 'ALL') {
      this.filteredMatches = this.matches;
    } else {
      this.filteredMatches = this.matches.filter(
        m => m.status === this.filter
      );
    }
    }
    setFilter(value: 'ALL' | 'UPCOMING' | 'FINISHED') {
    this.filter = value;
    this.applyFilter();
  }

  loadMatches() {
    this.loading = true;
    this.error = '';

    this.service.getAllMatches().subscribe({
      next: (res: any) => {

        const data = res?.data ?? res ?? [];

        this.matches = data;
        this.applyFilter();

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load matches';
        this.loading = false;
      }
    });
  }

  // =========================
  // MODAL
  // =========================
  openCreateMatch() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

    // reset form
    this.newMatch = {
      homeTeamId: 0,
      awayTeamId: 0,
      matchDate: '',
      matchTime: ''
    };

     this.cdr.detectChanges();
  }

  // =========================
  // CREATE MATCH
  // =========================
  createMatch() {

  // ✅ validation (important: allow null-safe check)
  if (
    this.newMatch.homeTeamId == null ||
    this.newMatch.awayTeamId == null ||
    !this.newMatch.matchDate ||
    !this.newMatch.matchTime
  ) {
    alert('Please fill all fields');
    return;
  }

  // ❌ prevent same team match
  if (this.newMatch.homeTeamId === this.newMatch.awayTeamId) {
    alert('Home team and Away team cannot be the same');
    return;
  }

  // ✅ optional: build clean payload (recommended)
  const payload = {
    homeTeamId: this.newMatch.homeTeamId,
    awayTeamId: this.newMatch.awayTeamId,
    matchDate: this.newMatch.matchDate,
    matchTime: this.newMatch.matchTime + ':00'
  };

  this.service.createMatch(payload).subscribe({
    next: (res: any) => {

      const createdMatch = res?.data ?? res;
      this.matches.unshift(createdMatch); // better UX than push()

      this.closeModal();
    },
    error: (err) => {
      console.error(err);
      alert('Failed to create match');
    }
  });
}

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.teams = res;
      },
      error: (err) => console.error(err)
    });
  }
  // =========================
  // FINISH MATCH
  // =========================
submitFinishMatch() {

  if (
    this.finishForm.homeScore == null ||
    this.finishForm.awayScore == null
  ) {
    alert('Please fill scores');
    return;
  }

  const payload = {
    homeScore: Number(this.finishForm.homeScore),
    awayScore: Number(this.finishForm.awayScore),

    homeRed: Number(this.finishForm.homeRed),
    awayRed: Number(this.finishForm.awayRed),

    homeOut: Number(this.finishForm.homeOut),
    awayOut: Number(this.finishForm.awayOut),

    mvpId: this.finishForm.mvpId ? Number(this.finishForm.mvpId) : null
  };

  this.service.finishMatch(this.selectedMatch!.matchId, payload)
    .subscribe({
      next: (res: any) => {

        if (this.selectedMatch) {
          this.selectedMatch.status = 'FINISHED';
        }

        this.closeFinishModal();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to finish match');
      }
    });
}

openFinish(match: Match) {
  this.selectedMatch = match;
  this.finishModal = true;
}

closeFinishModal() {
  this.finishModal = false;
  this.selectedMatch = undefined;

  this.finishForm = {
  homeScore: null,
  awayScore: null,
  homeRed: 0,
  awayRed: 0,

  homeOut: 0,
  awayOut: 0,
  mvpId: null
  };

  this.cdr.detectChanges();
}

openResult(match: Match) {
  this.selectedResult = null;
  this.loadingResult = true;
  this.resultModal = true;

  this.matchService.getMatchResult(match.matchId)
    .subscribe({
      next: (res: MatchResultResponse) => {
        this.selectedResult = res;
        this.loadingResult = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingResult = false;
        this.resultModal = false;
        this.cdr.detectChanges();
      }
    });
}

closeResultModal() {
  this.resultModal = false;
  this.selectedResult = null;
}
}
