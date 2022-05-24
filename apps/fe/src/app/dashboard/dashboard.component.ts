import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RootFacade } from '../state/root.facade';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'bff-oauth-poc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  user$ = this._rootFacade.user$;

  constructor(
    private readonly _rootFacade: RootFacade,
    private readonly _authService: AuthService
  ) {}

  logout() {
    this._authService.logout().subscribe();
  }
}
