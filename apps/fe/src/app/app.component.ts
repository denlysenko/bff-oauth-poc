import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'bff-oauth-poc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'fe';
}
