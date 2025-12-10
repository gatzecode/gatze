// logo.component.ts
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeMode } from '@app/core/services/config.service';

type LogoVariant =
  | 'immo-black-1'
  | 'immo-white-1'
  | 'immo-card-black-1'
  | 'immo-card-white-1'
  | 'immo-black-2'
  | 'immo-white-2'
  | 'immo-card-black-2'
  | 'immo-card-white-2';

@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  template: `
    <svg
      [attr.viewBox]="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      [style.width]="width()"
      [style.height]="height()"
      [attr.data-theme]="theme()"
    >
      <defs>
        <style>
          .cls-1,
          .cls-2,
          .cls-3,
          .cls-4,
          .cls-5 {
            fill: #1d1d1b;
          }
          .cls-6,
          .cls-7,
          .cls-8,
          .cls-9 {
            fill: #fff;
          }
          .cls-2,
          .cls-8 {
            font-family: TussilagoHv-Regular, Tussilago;
            font-size: 141.12px;
          }
          .cls-7,
          .cls-4 {
            stroke: #1d1d1b;
            stroke-miterlimit: 10;
            stroke-width: 0.25px;
          }
          .cls-3 {
            font-family: MyriadPro-Regular, 'Myriad Pro';
            font-size: 12px;
          }
          .cls-9,
          .cls-5 {
            font-family: TussilagoRg-Regular, Tussilago;
            font-size: 17.59px;
          }

          /* Auto dark mode support */
          @media (prefers-color-scheme: dark) {
            svg[data-theme='auto'] .cls-1,
            svg[data-theme='auto'] .cls-2,
            svg[data-theme='auto'] .cls-3,
            svg[data-theme='auto'] .cls-4,
            svg[data-theme='auto'] .cls-5 {
              fill: #ffffff;
            }
            svg[data-theme='auto'] .cls-7,
            svg[data-theme='auto'] .cls-4 {
              stroke: #ffffff;
            }
          }

          /* Manual dark mode */
          svg[data-theme='dark'] .cls-1,
          svg[data-theme='dark'] .cls-2,
          svg[data-theme='dark'] .cls-3,
          svg[data-theme='dark'] .cls-4,
          svg[data-theme='dark'] .cls-5 {
            fill: #ffffff;
          }
          svg[data-theme='dark'] .cls-7,
          svg[data-theme='dark'] .cls-4 {
            stroke: #ffffff;
          }
        </style>
      </defs>

      <!-- IMMO Black #1 (Top Left) -->
      @if (effectiveVariant() === 'immo-black-1' || effectiveVariant() === 'immo-white-1') {
      <g>
        <path class="cls-1" d="M82.54,377.97v-107.36h31.72v107.36h-31.72Z" />
        <path
          class="cls-1"
          d="M300.59,377.97v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
        />
        <path
          class="cls-1"
          d="M514.35,377.97v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
        />
        <path
          class="cls-4"
          d="M724.89,285.74c-9.19,5.33-17.94,11.33-26.58,17.49,2.21,4.55,3.06,10.36,3.06,17.65,0,23.15-8.72,31.4-42.66,31.4-12.11,0-20.97-1.08-27.38-3.53-3.04,2.04-6.08,4.07-9.11,6.13-5.85,3.97-11.79,7.96-17.62,12.09,12.78,7.87,30.99,11.01,54.11,11.01,49,0,75.8-13.96,75.8-57.09,0-15.06-3.29-26.54-9.62-35.13Z"
        />
        <path
          class="cls-4"
          d="M573.67,364.06c6.32-4.54,12.77-8.92,19.14-13.28,2.22-1.52,4.45-3.02,6.68-4.53-4.36-4.96-5.93-12.09-5.93-21.89,0-23.31,8.72-31.56,42.34-31.56,16.14,0,26.57,1.87,33.08,6.34,8.48-6.07,17.06-12.01,26.03-17.35-1.78-1.46-3.69-2.8-5.75-4.02-12.71-7.5-30.65-10.5-53.35-10.5-48.84,0-75.8,13.96-75.8,57.09,0,17.9,4.66,30.76,13.57,39.7Z"
        />
      </g>
      }

      <!-- IMMO CARD Black #1 (Top Center) -->
      @if (effectiveVariant() === 'immo-card-black-1' || effectiveVariant() === 'immo-card-white-1')
      {
      <g>
        <path class="cls-1" d="M1033.11,296.84v-107.36h31.72v107.36h-31.72Z" />
        <path
          class="cls-1"
          d="M1251.16,296.84v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
        />
        <path
          class="cls-1"
          d="M1251.37,441.86v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
        />
        <path
          class="cls-4"
          d="M1461.91,349.64c-9.19,5.33-17.94,11.33-26.58,17.49,2.21,4.55,3.06,10.36,3.06,17.65,0,23.15-8.72,31.4-42.66,31.4-12.11,0-20.97-1.08-27.38-3.53-3.04,2.04-6.08,4.07-9.11,6.13-5.85,3.97-11.79,7.96-17.62,12.09,12.78,7.87,30.99,11.01,54.11,11.01,49,0,75.8-13.96,75.8-57.09,0-15.06-3.29-26.54-9.62-35.13Z"
        />
        <path
          class="cls-4"
          d="M1310.7,427.95c6.32-4.54,12.77-8.92,19.14-13.28,2.22-1.52,4.45-3.02,6.68-4.53-4.36-4.96-5.93-12.09-5.93-21.89,0-23.31,8.72-31.56,42.34-31.56,16.14,0,26.57,1.87,33.08,6.34,8.48-6.07,17.06-12.01,26.03-17.35-1.78-1.46-3.69-2.8-5.75-4.02-12.71-7.5-30.65-10.5-53.35-10.5-48.84,0-75.8,13.96-75.8,57.09,0,17.9,4.66,30.76,13.57,39.7Z"
        />
        <text class="cls-5" transform="translate(1320.46 317.41)">
          <tspan x="0" y="0">C A R D</tspan>
        </text>
      </g>
      }

      <!-- IMMO Black #2 (Top Right) -->
      @if (effectiveVariant() === 'immo-black-2' || effectiveVariant() === 'immo-white-2') {
      <g>
        <text class="cls-2" transform="translate(1815.26 365.33)">
          <tspan x="0" y="0">IMMO</tspan>
        </text>
      </g>
      }

      <!-- IMMO Black #3 (Far Right Top) -->
      @if (effectiveVariant() === 'immo-card-black-2' || effectiveVariant() === 'immo-card-white-2')
      {
      <g>
        <path
          class="cls-4"
          d="M3029.71,278.79c-9.19,5.33-17.94,11.33-26.58,17.49,2.21,4.55,3.06,10.36,3.06,17.65,0,23.15-8.72,31.4-42.66,31.4-12.11,0-20.97-1.08-27.38-3.53-3.04,2.04-6.08,4.07-9.11,6.13-5.85,3.97-11.79,7.96-17.62,12.09,12.78,7.87,30.99,11.01,54.11,11.01,49,0,75.8-13.96,75.8-57.09,0-15.06-3.29-26.54-9.62-35.13Z"
        />
        <path
          class="cls-4"
          d="M2878.49,357.11c6.32-4.54,12.77-8.92,19.14-13.28,2.22-1.52,4.45-3.02,6.68-4.53-4.36-4.96-5.93-12.09-5.93-21.89,0-23.31,8.72-31.56,42.34-31.56,16.14,0,26.57,1.87,33.08,6.34,8.48-6.07,17.06-12.01,26.03-17.35-1.78-1.46-3.69-2.8-5.75-4.02-12.71-7.5-30.65-10.5-53.35-10.5-48.84,0-75.8,13.96-75.8,57.09,0,17.9,4.66,30.76,13.57,39.7Z"
        />
      </g>
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      svg {
        display: block;
      }
    `,
  ],
})
export class Logo {
  readonly variant = input<LogoVariant>('immo-black-1');
  readonly width = input<string>('auto');
  readonly height = input<string>('100px');
  readonly theme = input<ThemeMode>('auto');

  // Normaliza la variante para usar el mismo SVG path
  readonly effectiveVariant = computed(() => {
    const v = this.variant();
    // Convierte todas las variantes white a black para reusar el mismo path
    if (v.includes('white')) {
      return v.replace('white', 'black') as LogoVariant;
    }
    return v;
  });

  private readonly viewBoxMap: Record<string, string> = {
    'immo-black-1': '40 250 720 150',
    'immo-card-black-1': '1000 180 500 270',
    'immo-black-2': '1800 260 520 140',
    'immo-card-black-2': '2866 245 173 135',
  };

  get viewBox(): string {
    const normalizedVariant = this.effectiveVariant().replace('white', 'black');
    return this.viewBoxMap[normalizedVariant];
  }
}
