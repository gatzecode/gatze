import { Injectable, signal, effect, computed, DestroyRef, inject } from '@angular/core';
import { LocalStorageService } from './localstorege.service';
import { AvailableLangs, TranslocoService } from '@jsverse/transloco';

export type ThemeColor = 'indigo' | 'green' | 'rose' | 'orange';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type LayoutType = 'classic' | 'dense';
export type LangCode = 'es' | 'en';

export interface AppConfig {
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  layout: LayoutType;
  lang: LangCode;
}

const DEFAULT_CONFIG: AppConfig = {
  themeColor: 'orange',
  themeMode: 'auto',
  layout: 'classic',
  lang: 'es',
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private destroyRef = inject(DestroyRef);
  private storage = inject(LocalStorageService);
  private translocoService = inject(TranslocoService);

  // Available options
  readonly availableColors: ThemeColor[] = ['orange', 'indigo', 'green', 'rose'];
  readonly availableModes: ThemeMode[] = ['light', 'dark', 'auto'];
  readonly availableLayouts: LayoutType[] = ['classic', 'dense'];
  readonly availableLangs = signal<AvailableLangs>([]);

  // Configuration signals
  readonly themeColor = signal<ThemeColor>(DEFAULT_CONFIG.themeColor);
  readonly themeMode = signal<ThemeMode>(DEFAULT_CONFIG.themeMode);
  readonly layout = signal<LayoutType>(DEFAULT_CONFIG.layout);
  readonly langCode = signal<LangCode>(DEFAULT_CONFIG.lang);

  // System preference tracking
  private systemPrefersDark = signal<boolean>(false);

  // Computed: actual dark mode state (respects 'auto' mode)
  readonly isDarkMode = computed(() => {
    const mode = this.themeMode();
    if (mode === 'auto') {
      return this.systemPrefersDark();
    }
    return mode === 'dark';
  });

  // Computed: full config object
  readonly config = computed<AppConfig>(() => ({
    themeColor: this.themeColor(),
    themeMode: this.themeMode(),
    layout: this.layout(),
    lang: this.langCode(),
  }));

  constructor() {
    // Load saved configuration
    this.loadFromStorage();

    // Initialize system preference detection
    this.initSystemPreferenceDetection();

    // Initialize Transloco integration
    this.initTransloco();

    // Apply theme whenever any relevant signal changes
    effect(() => {
      this.applyTheme();
    });

    // Save config whenever it changes
    effect(() => {
      this.saveToStorage();
    });
  }

  // ==========================================
  // Public API
  // ==========================================

  /**
   * Set theme color palette
   */
  setThemeColor(color: ThemeColor): void {
    this.themeColor.set(color);
  }

  /**
   * Set theme mode (light, dark, auto)
   */
  setThemeMode(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  /**
   * Set lang code (es, en)
   */
  setActiveLang(lang: LangCode): void {
    this.langCode.set(lang);
    this.translocoService.setActiveLang(lang);
  }

  /**
   * Set layout type
   */
  setLayout(layout: LayoutType): void {
    this.layout.set(layout);
  }

  /**
   * Toggle between light and dark mode
   * (if currently in auto mode, switches to manual light/dark)
   */
  toggleDarkMode(): void {
    const currentMode = this.themeMode();
    if (currentMode === 'auto') {
      // If in auto mode, switch to manual based on current system preference
      this.themeMode.set(this.systemPrefersDark() ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      this.themeMode.set(currentMode === 'dark' ? 'light' : 'dark');
    }
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.themeColor.set(DEFAULT_CONFIG.themeColor);
    this.themeMode.set(DEFAULT_CONFIG.themeMode);
    this.layout.set(DEFAULT_CONFIG.layout);
  }

  /**
   * Get current theme as CSS class name
   */
  getThemeClass(): string {
    const theme = this.themeColor();
    return theme !== 'indigo' ? `theme-${theme}` : '';
  }

  /**
   * Check if currently using system preference
   */
  isAutoMode(): boolean {
    return this.themeMode() === 'auto';
  }

  // ==========================================
  // Private methods
  // ==========================================

  private loadFromStorage(): void {
    const saved = this.storage.get<AppConfig>('app-config', DEFAULT_CONFIG);

    if (saved.themeColor && this.availableColors.includes(saved.themeColor)) {
      this.themeColor.set(saved.themeColor);
    }

    if (saved.themeMode && this.availableModes.includes(saved.themeMode)) {
      this.themeMode.set(saved.themeMode);
    }

    if (saved.layout && this.availableLayouts.includes(saved.layout)) {
      this.layout.set(saved.layout);
    }
  }

  private saveToStorage(): void {
    this.storage.set<AppConfig>('app-config', this.config());
  }

  private applyTheme(): void {
    const html = document.documentElement;
    const color = this.themeColor();
    const isDark = this.isDarkMode();

    // Remove all theme color classes
    this.availableColors.forEach((c) => html.classList.remove(`theme-${c}`));

    // Add current theme class (skip indigo as it's the default)
    if (color !== 'indigo') {
      html.classList.add(`theme-${color}`);
    }

    // Apply dark mode class
    html.classList.toggle('dark', isDark);
  }

  private initSystemPreferenceDetection(): void {
    // Set initial value
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark.set(mediaQuery.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => {
      this.systemPrefersDark.set(e.matches);
    };

    mediaQuery.addEventListener('change', listener);

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      mediaQuery.removeEventListener('change', listener);
    });
  }

  private initTransloco(): void {
    // Get available languages from Transloco
    this.availableLangs.set(this.translocoService.getAvailableLangs());

    // Set initial language from saved config
    this.translocoService.setActiveLang(this.langCode());

    // Sync Transloco changes back to config
    // This ensures config stays in sync if language changes from other sources
    this.translocoService.langChanges$.subscribe((lang) => {
      this.langCode.set(lang as LangCode);
    });
  }
}
