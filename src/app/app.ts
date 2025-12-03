import { Component } from '@angular/core';
import { Main } from './shared/layouts/main/main';

@Component({
  selector: 'app-root',
  imports: [Main],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
