import { Component, input } from '@angular/core';

@Component({
  selector: 'app-identity',
  imports: [],
  template: `
    <a class="flex items-center w-full" href="./">
      <svg
        class="fill-current logo-icon"
        [attr.width]="width()"
        [attr.height]="height()"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"
        />
      </svg>

      <span
        class="logo-text font-semibold text-lg tracking-wide"
        [class.logo-text--visible]="showText()"
        [class.logo-text--hidden]="!showText()"
      >
        {{ text() }}
      </span>
    </a>
  `,
  styles: [
    `
      .logo-icon {
        transition: all 300ms ease-in-out;
        flex-shrink: 0;
      }

      .logo-text {
        white-space: nowrap;
        overflow: hidden;
        transition: opacity 250ms ease-in-out, max-width 250ms ease-in-out, margin 250ms ease-in-out;
      }

      .logo-text--visible {
        opacity: 1;
        max-width: 200px;
        margin-left: 0.75rem;
      }

      .logo-text--hidden {
        opacity: 0;
        max-width: 0;
        margin-left: 0;
        pointer-events: none;
      }
    `,
  ],
})
export class AppIdentity {
  // Input properties
  width = input<string | number>('12');
  height = input<string | number>('12');
  showText = input<boolean>(true);
  text = input<string>('The App');
  containerClass = input<string>('');
}
