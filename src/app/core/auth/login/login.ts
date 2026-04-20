import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../shared/dto/login-request.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';
  error = '';
  
  constructor(private auth: Auth, private router: Router) {}

login() {
  const payload: LoginRequest = {
    email: this.email,
    password: this.password
  };

  this.auth.login(payload).subscribe({
    next: () => {
      const role = this.auth.getRole();

      if (role === 'SuperAdmin') {
        this.router.navigate(['/super-admin']);
      } else if (role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/login']);
      }
    },
    error: () => {
      this.error = 'Invalid email or password';
    }
  });
}
}
