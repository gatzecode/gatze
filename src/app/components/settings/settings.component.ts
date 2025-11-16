// settings.component.ts
import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigService, ThemeColor, ThemeMode, LayoutType } from '../../core/services/config.service';

@Component({
  selector: 'app-settings',

  imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  protected configService = inject(ConfigService);

  // Inputs
  currentLayout = input.required<LayoutType>();
  availableLayouts = input.required<LayoutType[]>();
  availableThemes = input.required<ThemeColor[]>();

  // Outputs
  layoutChange = output<LayoutType>();
  themeChange = output<ThemeColor>();
  schemeChange = output<ThemeMode>();

  /**
   * Cambia el layout de navegación
   */
  onLayoutChange(value: LayoutType): void {
    this.layoutChange.emit(value);
  }

  /**
   * Cambia el tema de color
   */
  onThemeChange(theme: ThemeColor): void {
    this.themeChange.emit(theme);
  }

  /**
   * Cambia el esquema de color (light/dark/auto)
   */
  setScheme(scheme: ThemeMode): void {
    this.schemeChange.emit(scheme);
  }
}
