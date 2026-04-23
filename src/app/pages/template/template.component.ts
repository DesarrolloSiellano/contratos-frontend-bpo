import { Component, inject, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../shared/services/loading.service';


@Component({
  selector: 'app-template',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    RouterOutlet,
    ProgressSpinnerModule,
  ],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss',
})
export class TemplateComponent implements AfterViewInit {
  private loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;
  nameUser = '';

  ngAfterViewInit(): void {
    if (localStorage.getItem('userName')) {
      this.nameUser = String(localStorage.getItem('userName')) || '';
    }
    //window.location.reload();

  }

}
