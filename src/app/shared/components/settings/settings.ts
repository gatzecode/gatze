import { Component, inject, input, output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  ConfigService,
  ThemeColor,
  ThemeMode,
  LayoutType,
} from '@app/core/services/config.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-settings',

  imports: [MatIconModule, MatButtonModule, MatDividerModule, TranslocoModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
})
export class Settings {
  protected configService = inject(ConfigService);

  // Inputs
  currentLayout = input.required<LayoutType>();
  availableLayouts = input.required<LayoutType[]>();
  availableThemes = input.required<ThemeColor[]>();

  // Outputs
  layoutChange = output<LayoutType>();
  themeChange = output<ThemeColor>();
  schemeChange = output<ThemeMode>();

  onLayoutChange(value: LayoutType): void {
    this.layoutChange.emit(value);
  }

  onThemeChange(theme: ThemeColor): void {
    this.themeChange.emit(theme);
  }

  setScheme(scheme: ThemeMode): void {
    this.schemeChange.emit(scheme);
  }
}
