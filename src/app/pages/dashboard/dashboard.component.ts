import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = {
    activeContract: 124,
    contractors: 58,
    pendingPayments: 17,
    expiringContract: 9
  };

  contract = [
    {
      code: 'CT-1001',
      contractor: 'Juan Pérez',
      status: 'Active',
      date: '2026-05-20',
      amount: '$8.000.000'
    },
    {
      code: 'CT-1002',
      contractor: 'Ana Gómez',
      status: 'Pending',
      date: '2026-05-18',
      amount: '$12.500.000'
    },
    {
      code: 'CT-1003',
      contractor: 'Carlos Ruiz',
      status: 'Finished',
      date: '2026-05-15',
      amount: '$6.300.000'
    }
  ];
}