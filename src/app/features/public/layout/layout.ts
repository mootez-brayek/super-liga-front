import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Standing } from '../../../shared/models/standing.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../../../core/services/public';
import { MatchResponse } from '../../../shared/dto/match-response.dto';
import { MatchResultResponse } from '../../../shared/dto/match-result.dto';
import { TeamResponse } from '../../../shared/dto/team-response.dto';
import { PlayerResponse } from '../../../shared/dto/player-response.dto';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit{

  activeSection: string = 'standings';
  menuOpen = false;
  loading = false;
  error = false;
  loadingUpcoming = false;
  errorUpcoming = false;
  loadingFinished = false;
  errorFinished = false;
  loadingTeams = false;
  errorTeams = false;
  loadingPlayers = false;
  errorPlayers = false;
  showPlayersModal = false;
  private ticking = false;

  upcomingMatches: MatchResponse[] = [];
  standings: Standing[] = [];
  finishedMatches: MatchResultResponse[] = [];
  teams: TeamResponse[] = [];
  playersByTeam: { [key: number]: PlayerResponse[] } = {};
  selectedTeam: TeamResponse | null = null;
  selectedPlayers: PlayerResponse[] = [];

  constructor(private api: PublicService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStandings();
    this.loadUpcomingMatches();
    this.loadFinishedMatches();
    this.loadTeams();
  }

  loadUpcomingMatches() {
    this.loadingUpcoming = true;
    this.errorUpcoming = false;

    this.api.getUpcomingMatches().subscribe({
      next: (data) => {
        this.upcomingMatches = data ?? [];
        this.loadingUpcoming = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingUpcoming = false;
        this.errorUpcoming = true;
      }
    });
  }

  loadFinishedMatches() {
    this.loadingFinished = true;
    this.errorFinished = false;

    this.api.getfinishedMatches().subscribe({
      next: (data) => {
        this.finishedMatches = data ?? [];
        this.loadingFinished = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingFinished = false;
        this.errorFinished = true;
      }
    });
  }

  loadStandings() {
    this.loading = true;
    this.error = false;

    this.api.getStandings().subscribe({
      next: (data) => {
        this.standings = data ?? []
        this.loading = false;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Standings error:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  loadTeams() {
    this.loadingTeams = true;
    this.errorTeams = false;

    this.api.getTeams().subscribe({
      next: (data) => {
        this.teams = data ?? [];
        this.loadingTeams = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingTeams = false;
        this.errorTeams = true;
      }
    });
  }

  openTeam(team: TeamResponse) {
    this.selectedTeam = team;
    this.showPlayersModal = true;

    this.loadingPlayers = true;
    this.errorPlayers = false;
    console.log(team.teamId)
    this.api.getPlayersByTeam(team.teamId).subscribe({
      next: (data) => {
        this.selectedPlayers = data ?? [];
        console.log(data);
        this.loadingPlayers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingPlayers = false;
        this.errorPlayers = true;
      }
    });
  }

  getFootState(p: PlayerResponse) {
    return {
      left: p.strongFoot === 'LEFT' || p.strongFoot === 'BOTH',
      right: p.strongFoot === 'RIGHT' || p.strongFoot === 'BOTH',
      both: p.strongFoot === 'BOTH'
    };
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  setActive(section: string) {
    this.activeSection = section;
    this.menuOpen = false;
  }

  closeModal() {
    this.showPlayersModal = false;
    this.selectedPlayers = [];
  }

  scrollTo(section: string, event: Event) {
    event.preventDefault();

    const el = document.getElementById(section);
    if (!el) return;

    this.menuOpen = false;
    this.activeSection = section;

    const top = el.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: top - 70, // navbar offset
      behavior: 'smooth'
    });
  }

@HostListener('window:scroll', [])
onScroll() {
  if (this.ticking) return;

  this.ticking = true;

  requestAnimationFrame(() => {
    const sections = ['standings', 'matches', 'teams'];
    const scroll = window.scrollY + 180;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);

      if (el && scroll >= el.offsetTop) {
        this.activeSection = sections[i];
        break;
      }
    }

    this.ticking = false;
  });
}
}
