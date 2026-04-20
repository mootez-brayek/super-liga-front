import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StandingService } from '../../../core/services/standing';
import { FormsModule } from '@angular/forms';
import { Standing } from '../../../shared/models/standing.model';

@Component({
  selector: 'app-standing',
  imports: [CommonModule, FormsModule],
  templateUrl: './standing.html',
  styleUrl: './standing.scss',
})
export class StandingsComponent implements OnInit{

  standings: Standing[] = [];
  loading = false;

  constructor(private service: StandingService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStandings();
  }

  loadStandings() {
  this.loading = true;

  this.service.getStandings().subscribe({
    next: (res) => {
      this.standings = res ?? [];
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}
}
