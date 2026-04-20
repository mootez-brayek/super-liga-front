import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../../core/services/super-admin';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { CreateAdminDTO } from '../../../shared/dto/create-admin.dto';
import { CreateAdminResponse } from '../../../shared/dto/create-admin-response.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admins',
  imports: [CommonModule, FormsModule],
  templateUrl: './admins.html',
  styleUrl: './admins.scss',
})
export class Admins implements OnInit{
  admins: User[] = [];
  loading = false;
  error = '';

  showModal = false;

  newAdmin: CreateAdminDTO = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };

  constructor(private service: SuperAdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      
    this.loadAdmins();
  }

  loadAdmins() {
    this.loading = true;
    this.error = '';
    this.service.getAdmins().subscribe({
      next: (res: any) => {

        if (res?.data) {
          this.admins = res.data;
        } else if (Array.isArray(res)) {
          this.admins = res;
        } else {
          this.admins = [];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.admins = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleStatus(admin: any) {
    this.service.toggleAdminStatus(admin.userId).subscribe({
      next: () => {
        admin.active = !admin.active;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  openCreateAdmin() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

    this.newAdmin = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    };
  }

  createAdmin() {
    this.service.createAdmin(this.newAdmin).subscribe({
      next: (res: CreateAdminResponse) => {
        this.loadAdmins();
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
