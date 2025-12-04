import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly environment = import.meta.env.ENVIRONMENT;

  constructor() {
    console.log(`App initialized in ${this.environment} mode.`);
  }
}
