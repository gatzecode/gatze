import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  template: `
    <div class="logo-container" [class]="containerClass()">
      <svg
        [attr.width]="width()"
        [attr.height]="height()"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >
        <!-- Cat silhouette with geometric design -->
        <g class="cat-design">
          <!-- Left ear -->
          <path d="M20 35 L35 15 L40 35 Z" class="fill-primary transition-colors duration-300" />

          <!-- Right ear -->
          <path d="M80 35 L85 15 L100 35 Z" class="fill-primary transition-colors duration-300" />

          <!-- Head -->
          <circle cx="60" cy="55" r="32" class="fill-primary transition-colors duration-300" />

          <!-- Face details -->
          <!-- Left eye -->
          <ellipse
            cx="48"
            cy="50"
            rx="4"
            ry="6"
            class="fill-on-primary dark:fill-primary-container transition-colors duration-300"
          />

          <!-- Right eye -->
          <ellipse
            cx="72"
            cy="50"
            rx="4"
            ry="6"
            class="fill-on-primary dark:fill-primary-container transition-colors duration-300"
          />

          <!-- Nose -->
          <path
            d="M60 58 L56 62 L64 62 Z"
            class="fill-on-primary dark:fill-primary-container transition-colors duration-300"
          />

          <!-- Mouth -->
          <path
            d="M60 62 Q56 66 52 64 M60 62 Q64 66 68 64"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            class="text-on-primary dark:text-primary-container transition-colors duration-300"
            fill="none"
          />

          <!-- Body -->
          <ellipse
            cx="60"
            cy="95"
            rx="28"
            ry="20"
            class="fill-primary transition-colors duration-300"
          />

          <!-- Tail -->
          <path
            d="M85 95 Q100 85 105 70 Q107 75 102 80 Q95 90 88 95"
            class="fill-primary transition-colors duration-300"
          />

          <!-- Whiskers - Left -->
          <line
            x1="35"
            y1="55"
            x2="20"
            y2="52"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            class="text-on-primary dark:text-primary-container transition-colors duration-300"
          />
          <line
            x1="35"
            y1="60"
            x2="20"
            y2="60"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            class="text-on-primary dark:text-primary-container transition-colors duration-300"
          />

          <!-- Whiskers - Right -->
          <line
            x1="85"
            y1="55"
            x2="100"
            y2="52"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            class="text-on-primary dark:text-primary-container transition-colors duration-300"
          />
          <line
            x1="85"
            y1="60"
            x2="100"
            y2="60"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            class="text-on-primary dark:text-primary-container transition-colors duration-300"
          />
        </g>
      </svg>

      @if (showText()) {
      <span class="logo-text text-primary font-bold transition-colors duration-300">
        {{ text() }}
      </span>
      }
    </div>
  `,
  styles: [
    `
      .logo-container {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo-svg {
        flex-shrink: 0;
      }

      .logo-svg:hover .cat-design {
        transform: scale(1.05);
        transition: transform 0.2s ease-in-out;
      }

      .cat-design {
        transform-origin: center;
        transition: transform 0.2s ease-in-out;
      }

      .logo-text {
        font-size: 1.5rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        user-select: none;
      }

      @media (max-width: 640px) {
        .logo-text {
          font-size: 1.25rem;
        }
      }
    `,
  ],
})
export class LogoGatze {
  // Input properties
  width = input<string | number>('48');
  height = input<string | number>('48');
  showText = input<boolean>(true);
  text = input<string>('Gatze');
  containerClass = input<string>('');
}
