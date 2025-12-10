import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<div class="min-h-screen bg-background">
    <router-outlet></router-outlet>
  </div>`,
})
export class App {
  private readonly environment = import.meta.env.ENVIRONMENT;

  constructor() {
    console.log(`App initialized in ${this.environment} mode.`);
  }
}
