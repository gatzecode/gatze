import { Injectable, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * Service to handle responsive breakpoint detection
 * Provides both Observable and Signal-based APIs
 */
@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  /**
   * Observable that emits true when device is in handset mode
   */
  readonly isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  /**
   * Signal that reflects handset state
   */
  readonly isHandset: Signal<boolean> = toSignal(this.isHandset$, {
    initialValue: false
  });

  /**
   * Observable that emits true when device is in tablet mode
   */
  readonly isTablet$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Tablet)
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  /**
   * Signal that reflects tablet state
   */
  readonly isTablet: Signal<boolean> = toSignal(this.isTablet$, {
    initialValue: false
  });

  /**
   * Observable that emits true when device is in web mode
   */
  readonly isWeb$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  /**
   * Signal that reflects web state
   */
  readonly isWeb: Signal<boolean> = toSignal(this.isWeb$, {
    initialValue: false
  });
}
