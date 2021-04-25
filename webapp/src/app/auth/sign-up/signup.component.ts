import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onSignup(form: NgForm): void {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
