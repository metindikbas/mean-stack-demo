import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading: boolean = false;

  onLogin(form: NgForm): void {
    console.log(form.value);
  }
}
