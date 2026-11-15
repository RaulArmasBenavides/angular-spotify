import { Component } from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { AppStateService } from '@core/store/app-state.service';

@Component({
    selector: 'app-account-page',
    templateUrl: './account-page.component.html',
    styleUrls: ['./account-page.component.css'],
    standalone: false
})
export class AccountPageComponent {
  readonly username: string;
  readonly userId: string;
  confirmReset: boolean = false;
  resetDone: boolean = false;

  constructor(
    private session: SessionService,
    private appState: AppStateService
  ) {
    this.username = this.session.getUsername();
    this.userId = this.session.getUserId();
  }

  logout(): void {
    this.session.logout();
  }

  askResetPlaylists(): void {
    this.resetDone = false;
    this.confirmReset = true;
  }

  cancelReset(): void {
    this.confirmReset = false;
  }

  resetPlaylists(): void {
    this.appState.resetPlaylists();
    this.confirmReset = false;
    this.resetDone = true;
  }
}
