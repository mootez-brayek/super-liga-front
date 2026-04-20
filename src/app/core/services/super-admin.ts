import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { DashboardStatsDTO } from '../../shared/dto/dashboard-stats.dto';
import { User } from '../../shared/models/user.model';
import { Match } from '../../shared/models/match.model';
import { CreateAdminDTO } from '../../shared/dto/create-admin.dto';
import { CreateAdminResponse } from '../../shared/dto/create-admin-response.dto';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {

    constructor(private api: ApiService) {}

  getDashboardStats(): Observable<DashboardStatsDTO> {
      return this.api.get<DashboardStatsDTO>('api/super-admin/dashboard/stats');
  }

  // 👤 ADMINS
  getAdmins(): Observable<User[]> {
    return this.api.get<User[]>('api/super-admin/admins');
  }

  getAdminById(id: number): Observable<User> {
    return this.api.get<User>(`super-admin/admins/${id}`);
  }

  toggleAdminStatus(id: number) {
    return this.api.post<void>(`api/super-admin/${id}/toggle-status`, {});
  }

  createAdmin(data: CreateAdminDTO) {
    return this.api.post<CreateAdminResponse>(
      'api/super-admin/create-admin',
      data
    );
  }

  deleteAdmin(id: number): Observable<any> {
    return this.api.delete(`super-admin/admins/${id}`);
  }

  // ⚽ MATCHES
  getUpcomingMatches(): Observable<Match[]> {
    return this.api.get<Match[]>('api/super-admin/matches/upcoming');
  }

  getfinishedMatches(): Observable<Match[]> {
    return this.api.get<Match[]>('api/super-admin/matches/finished');
  }

  getAllMatches(): Observable<Match[]> {
    return this.api.get<Match[]>('api/super-admin/matches');
  }

  createMatch(data: any): Observable<any> {
    return this.api.post('api/super-admin/matches', data);
  }

  deleteMatch(id: number): Observable<any> {
    return this.api.delete(`super-admin/matches/${id}`);
  }

  finishMatch(matchId: number, payload: any) {
    return this.api.put(
      `api/super-admin/matches/${matchId}/finish`,
      payload
    );
  }
  
  
}
