import { Component } from '@angular/core';
import { MainComponent } from './layouts/main/main.component';

@Component({
  selector: 'app-root',
  imports: [
    MainComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
