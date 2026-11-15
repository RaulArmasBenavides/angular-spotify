import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@core/services/session.service';

@Component({
    selector: 'app-header-user',
    templateUrl: './header-user.component.html',
    styleUrls: ['./header-user.component.css'],
    standalone: false
})
export class HeaderUserComponent {
  menuOpen: boolean = false;

  constructor(
    private router: Router,
    private session: SessionService
  ) { }

  get username(): string {
    return this.session.getUsername();
  }

  get initial(): string {
    return this.username.charAt(0).toUpperCase();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  goToAccount(): void {
    this.closeMenu();
    this.router.navigate(['/', 'account']);
  }

  logout(): void {
    this.closeMenu();
    this.session.logout();
  }
}
