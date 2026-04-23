import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('contratos-frontend-bpo');

  company = '';

  constructor() { }

  ngOnInit(): void {
    this.company = localStorage.getItem('company') || '';
  }
}
