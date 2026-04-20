import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardStatsDTO } from '../../../shared/dto/dashboard-stats.dto';
import { SuperAdminService } from '../../../core/services/super-admin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  stats?: DashboardStatsDTO;
  loading = true;
  error = '';

  constructor(private service: SuperAdminService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

 loadDashboard() {
    this.loading = true;
    this.error = '';

    this.service.getDashboardStats().subscribe({
      next: (res: any) => {

        this.stats = res.data ?? res;
        this.loading = false;

        // 🔥 FORCE UI UPDATE (THIS FIXES YOUR ISSUE)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load dashboard';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }


}
