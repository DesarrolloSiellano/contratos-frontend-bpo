import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoutesModuleConfig } from '../../shared/interface/module-config.interface';
import { GetConfigAppService } from '../../shared/services/get-config.service';
import { environment } from '../../../environment/environment';    


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  routes: RoutesModuleConfig[] = [];
  title = environment.title;

  constructor(private getConfigApp: GetConfigAppService) {}

  ngOnInit(): void {
    this.routes = this.getConfigApp.getRoutes().map(route => ({
      ...route,
      open: true,
    }));
  }


  toggleSubmenu(route: RoutesModuleConfig): void {
    route.open = !route.open;
  }
}

