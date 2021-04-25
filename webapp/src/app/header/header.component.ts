import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private authListenerSubs: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isUserAuthenticated();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs?.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
