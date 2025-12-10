// card-preview.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'card-preview',
  imports: [CommonModule],
  template: `
    <div
      class="card-preview"
      [class.visa]="cardBrand() === 'VISA'"
      [class.mastercard]="cardBrand() === 'MASTERCARD'"
    >
      <div class="card-preview-content">
        <!-- Logo IMMO -->
        <div class="card-preview-logo">
          <svg viewBox="0 0 730 380" width="85" height="44">
            <path fill="white" d="M82.54,377.97v-107.36h31.72v107.36h-31.72Z" />
            <path
              fill="white"
              d="M300.59,377.97v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
            />
            <path
              fill="white"
              d="M514.35,377.97v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
            />
            <path
              fill="white"
              d="M724.89,285.74c-9.19,5.33-17.94,11.33-26.58,17.49,2.21,4.55,3.06,10.36,3.06,17.65,0,23.15-8.72,31.4-42.66,31.4-12.11,0-20.97-1.08-27.38-3.53-3.04,2.04-6.08,4.07-9.11,6.13-5.85,3.97-11.79,7.96-17.62,12.09,12.78,7.87,30.99,11.01,54.11,11.01,49,0,75.8-13.96,75.8-57.09,0-15.06-3.29-26.54-9.62-35.13Z"
            />
            <path
              fill="white"
              d="M573.67,364.06c6.32-4.54,12.77-8.92,19.14-13.28,2.22-1.52,4.45-3.02,6.68-4.53-4.36-4.96-5.93-12.09-5.93-21.89,0-23.31,8.72-31.56,42.34-31.56,16.14,0,26.57,1.87,33.08,6.34,8.48-6.07,17.06-12.01,26.03-17.35-1.78-1.46-3.69-2.8-5.75-4.02-12.71-7.5-30.65-10.5-53.35-10.5-48.84,0-75.8,13.96-75.8,57.09,0,17.9,4.66,30.76,13.57,39.7Z"
            />
          </svg>
        </div>

        <!-- Texto de marca -->
        <div class="card-preview-contactless">
          <span class="contactless-text">{{ cardBrand() | uppercase }}</span>
        </div>

        <!-- Chip -->
        <div class="card-preview-chip">
          <svg viewBox="0 0 40 30" width="50" height="38">
            <rect width="40" height="30" rx="3" fill="#d4af37" />
            <rect x="4" y="4" width="32" height="22" rx="2" fill="#c9a961" />
            <line x1="8" y1="10" x2="32" y2="10" stroke="#b8963d" stroke-width="0.5" />
            <line x1="8" y1="13" x2="32" y2="13" stroke="#b8963d" stroke-width="0.5" />
            <line x1="8" y1="16" x2="32" y2="16" stroke="#b8963d" stroke-width="0.5" />
            <line x1="8" y1="19" x2="32" y2="19" stroke="#b8963d" stroke-width="0.5" />
            <line x1="20" y1="4" x2="20" y2="26" stroke="#b8963d" stroke-width="0.5" />
            <line x1="14" y1="4" x2="14" y2="26" stroke="#b8963d" stroke-width="0.5" />
            <line x1="26" y1="4" x2="26" y2="26" stroke="#b8963d" stroke-width="0.5" />
          </svg>
        </div>

        <!-- Marca de agua -->
        <div class="card-watermark">
          <svg viewBox="0 0 730 380" width="320" height="165" opacity="0.08">
            <path fill="white" d="M82.54,377.97v-107.36h31.72v107.36h-31.72Z" />
            <path
              fill="white"
              d="M300.59,377.97v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
            />
            <path
              fill="white"
              d="M514.35,377.97v-75.01l-52.97,75.01h-25.69l-53.13-75.01v75.01h-29.5v-107.36h45.36l50.75,70.89,50.11-70.89h44.72v107.36h-29.66Z"
            />
            <path
              fill="white"
              d="M724.89,285.74c-9.19,5.33-17.94,11.33-26.58,17.49,2.21,4.55,3.06,10.36,3.06,17.65,0,23.15-8.72,31.4-42.66,31.4-12.11,0-20.97-1.08-27.38-3.53-3.04,2.04-6.08,4.07-9.11,6.13-5.85,3.97-11.79,7.96-17.62,12.09,12.78,7.87,30.99,11.01,54.11,11.01,49,0,75.8-13.96,75.8-57.09,0-15.06-3.29-26.54-9.62-35.13Z"
            />
            <path
              fill="white"
              d="M573.67,364.06c6.32-4.54,12.77-8.92,19.14-13.28,2.22-1.52,4.45-3.02,6.68-4.53-4.36-4.96-5.93-12.09-5.93-21.89,0-23.31,8.72-31.56,42.34-31.56,16.14,0,26.57,1.87,33.08,6.34,8.48-6.07,17.06-12.01,26.03-17.35-1.78-1.46-3.69-2.8-5.75-4.02-12.71-7.5-30.65-10.5-53.35-10.5-48.84,0-75.8,13.96-75.8,57.09,0,17.9,4.66,30.76,13.57,39.7Z"
            />
          </svg>
        </div>

        <!-- Número de tarjeta -->
        <div class="card-preview-number">
          {{ formattedCardNumber() }}
        </div>

        <!-- Footer -->
        <div class="card-preview-footer">
          <div class="card-preview-holder">
            <div class="card-preview-label">TITULAR</div>
            <div class="card-preview-name">
              {{ cardHolder() || 'NOMBRE DEL TITULAR' }}
            </div>
          </div>
          <div class="card-preview-expiry">
            <div class="card-preview-label">VENCE</div>
            <div class="card-preview-exp">
              {{ cardExpiration() || 'MM/YY' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        min-height: 100vh;
        background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .container > div:first-child {
        max-width: 42rem;
        width: 100%;
      }

      .card-container {
        perspective: 1000px;
      }

      .card-preview {
        width: 100%;
        max-width: 420px;
        aspect-ratio: 1.586;
        border-radius: 16px;
        padding: 28px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        color: white;
        transition: all 0.3s ease;
        margin: 0 auto;
      }

      .card-preview.visa {
        background: linear-gradient(135deg, #1a4d8f 0%, #2d6bb3 100%);
      }

      .card-preview.mastercard {
        background: linear-gradient(135deg, #8b1538 0%, #c41e3a 100%);
      }

      .card-preview::before {
        content: '';
        position: absolute;
        width: 350px;
        height: 350px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        top: -120px;
        right: -80px;
      }

      .card-preview-content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card-preview-logo {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
      }

      .card-preview-contactless {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        opacity: 0.95;
        z-index: 3;
      }

      .contactless-text {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 2px;
      }

      .card-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
        z-index: 0;
        pointer-events: none;
      }

      .card-preview-chip {
        margin-top: 55px;
        margin-bottom: 24px;
        position: relative;
        z-index: 2;
      }

      .card-preview-number {
        font-size: 24px;
        font-weight: 500;
        letter-spacing: 3px;
        margin-bottom: auto;
        font-family: 'Courier New', monospace;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 2;
        white-space: nowrap;
        overflow: visible;
      }

      .card-preview-footer {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        position: relative;
        z-index: 2;
      }

      .card-preview-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.2px;
        opacity: 0.85;
        margin-bottom: 5px;
      }

      .card-preview-name,
      .card-preview-exp {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 1.5px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        text-transform: uppercase;
      }

      .form-container {
        margin-top: 2rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        max-width: 36rem;
        margin-left: auto;
        margin-right: auto;
      }

      .form-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .form-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
      }

      .form-input,
      .form-select {
        width: 100%;
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s;
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        ring: 2px;
        ring-color: #3b82f6;
        border-color: transparent;
        box-shadow: 0 0 0 2px #3b82f6;
      }

      .form-input {
        font-family: 'Courier New', monospace;
      }

      @media (max-width: 640px) {
        .card-preview {
          max-width: 100%;
          padding: 20px;
        }

        .card-preview-number {
          font-size: 18px;
          letter-spacing: 2px;
        }

        .card-preview-name,
        .card-preview-exp {
          font-size: 13px;
        }
      }
    `,
  ],
})
export class CardPreview {
  // Inputs de tipo signal (read-only desde el padre)
  cardBrand = input<'VISA' | 'MASTERCARD'>('VISA');
  cardNumber = input<string>('4532123456789012');
  cardHolder = input<string>('JUAN PÉREZ GARCÍA');
  cardExpiration = input<string>('12/25');

  formattedCardNumber() {
    const number = this.cardNumber();
    if (!number) return '•••• •••• •••• ••••';
    const clean = number.replace(/\D/g, '').substring(0, 16);
    return clean.match(/.{1,4}/g)?.join(' ') || clean;
  }
}
