import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface AppNavItem {
  label: string;
  path: string;
  icon: 'patients' | 'dashboard' | 'templates' | 'account';
}

@Component({
  selector: 'fc-app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-navigation.component.html',
  styleUrl: './app-navigation.component.scss'
})
export class AppNavigationComponent {
  readonly navItems = input.required<ReadonlyArray<AppNavItem>>();
  readonly collapsed = input(false);
  readonly logout = output<void>();
  readonly toggleCollapsed = output<void>();

  protected onToggleCollapsed(): void {
    this.toggleCollapsed.emit();
  }

  protected onLogout(): void {
    this.logout.emit();
  }
}
