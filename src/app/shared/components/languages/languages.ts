import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ConfigService, LangCode } from '@app/core/services/config.service';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'languages',
  templateUrl: './languages.html',
  imports: [MatButtonModule, MatMenuModule, TranslocoModule],
})
export class Languages {
  private _configService = inject(ConfigService);

  // Get available languages and active language from ConfigService
  availableLangs = this._configService.availableLangs;
  activeLang = computed(() => this._configService.langCode());

  flagCodes: Record<string, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
  };

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active language
   * Delegates to ConfigService which handles Transloco synchronization
   *
   * @param lang - Language code to activate
   */
  setActiveLang(lang: string): void {
    this._configService.setActiveLang(lang as LangCode);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
