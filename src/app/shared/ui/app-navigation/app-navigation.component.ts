import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface AppNavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'fc-app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-navigation.component.html',
  styleUrl: './app-navigation.component.scss'
})
export class AppNavigationComponent {
  readonly navItems = input.required<ReadonlyArray<AppNavItem>>();
  readonly logout = output<void>();

  protected onLogout(): void {
    this.logout.emit();
  }
}
