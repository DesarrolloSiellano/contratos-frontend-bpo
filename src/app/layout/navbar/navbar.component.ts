import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarService } from '../services/sidebar.service';
import { ModuleConfig } from '../../shared/interface/module-config.interface';
import { GetConfigAppService } from '../../shared/services/get-config.service';
import { Router } from '@angular/router';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { IconDropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { DialogModule } from 'primeng/dialog';
import { CHANGE_PASSWORD_FORM } from '../../shared/forms/change-password.form';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';
import { ButtonModule } from 'primeng/button';
import { AuthService, ChangePassword } from '../../auth/service/auth';
import { Environment } from '../../../environment/environment';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast, ToastModule } from 'primeng/toast';
import { CustomDropdownComponent } from '../../shared/components/custom-dropdown/custom-dropdown.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    IconDropdownComponent,
    CustomDropdownComponent,
    FormsModule,
    DialogModule,
    FormTemplateComponent,
    ButtonModule,
    ToastModule,
    ConfirmDialog,
    AutoCompleteModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [SidebarService, AuthService, ConfirmService], // Proporciona el servicio de sidebar
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('dropdown') dropdown!: IconDropdownComponent;
  @ViewChild('dropdownCustomPanel')
  dropdownCustomPanel!: CustomDropdownComponent;

  @ViewChild(FormTemplateComponent)
  declare formComponent?: FormTemplateComponent;
  inputVisible: boolean = false;
  isSidebarOpen: boolean = false;
  moduleConfig: ModuleConfig = {} as ModuleConfig;
  username: string = '';
  private scrollListener!: () => void;
  title = Environment.title;
  panelMessage = 'Tu tienes 10 notificaciones';
  panelFooterMessage = 'Ver todas';



  cogOptions = [
    {
      label: 'Cambiar contraseña',
      action: () => this.changePassword(),
    },
  ];

  isDisplayChangePassword: boolean = false;
  changePasswordForm = CHANGE_PASSWORD_FORM;
  isAdmin = localStorage.getItem('isAdmin') || '';

  constructor(
    private sidebarService: SidebarService,
    private getConfigApp: GetConfigAppService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.moduleConfig = this.getConfigApp.getModule();
    this.username = this.getConfigApp.getUserName();
    this.sidebarService.sidebarState.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    if (this.isAdmin === 'false') {
      this.cogOptions = [
        {
          label: 'Cambiar contraseña',
          action: () => this.changePassword(),
        },
      ];

    }

    this.cdr.detectChanges();

    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      const navbarElement = this.el.nativeElement.querySelector('.navbar');
      if (window.scrollY > 50) {
        this.renderer.addClass(navbarElement, 'scrolled');
      } else {
        this.renderer.removeClass(navbarElement, 'scrolled');
      }
    });

    // Manejo resize y llamado inicial
    this.handleResize(); // Para el estado inicial
    this.renderer.listen('window', 'resize', () => {
      this.handleResize();
    });

    this.renderer.listen('document', 'click', (event) => {
      const content = document.querySelector(
        '.dashboard-content.dashboard-overlay'
      );
      if (content && content.contains(event.target)) {
        this.toggleSidebar();
      }
    });

    if (localStorage.getItem('isNewUser') === 'true') {
      this.isDisplayChangePassword = true;
    }
  }

  ngAfterViewInit(): void {
  }

  toggleDropdown(trigger: HTMLElement) {
    this.dropdown.open(trigger);
  }

  toggleCustomDropdown(trigger: HTMLElement) {
    this.dropdownCustomPanel.open(trigger);
  }






  handleResize(): void {
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');

    if (window.innerWidth <= 1024) {
      if (sidebar && !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
      }
      if (navbar) {
        navbar.classList.remove('sidebar-expanded');
        navbar.classList.add('sidebar-collapsed');
      }
    } else {
      // Solo expandir si estaba colapsado previamente
      if (sidebar && sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
      }
      if (navbar) {
        navbar.classList.remove('sidebar-collapsed');
        navbar.classList.add('sidebar-expanded');
      }
    }
  }



  toggleInput() {
    this.inputVisible = !this.inputVisible;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar(); // Cambia el estado

    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.dashboard-content');

    const isCollapsed = sidebar?.classList.toggle('collapsed'); // agrega o quita clase collapsed

    if (navbar) {
      if (isCollapsed) {
        navbar.classList.remove('sidebar-expanded');
        navbar.classList.add('sidebar-collapsed');
      } else {
        navbar.classList.remove('sidebar-collapsed');
        navbar.classList.add('sidebar-expanded');
      }
    }

    if (
      window.innerWidth <= 1024 &&
      sidebar &&
      !sidebar.classList.contains('collapsed')
    ) {
      content?.classList.add('dashboard-overlay');
    } else {
      content?.classList.remove('dashboard-overlay');
    }
  }

  async logout() {
    try {
      const isConfirm = await this.confirmService.confirm(
        'BpoNet',
        `Salir del sistema`,
        '¿Desea cerrar la sesión?',
        'pi pi-exclamation-triangle',
        'Cancelar',
        'Aceptar',
        'secondary',
        'danger'
      );

      if (isConfirm) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  changePassword() {
    this.isDisplayChangePassword = true;
  }

  closeDialog() {
    this.isDisplayChangePassword = false;
  }




  save() {
    this.loadingService.show();
    const changePassword: ChangePassword = {
      id: localStorage.getItem('_id') as string,
      currentPassword:
        this.formComponent?.formGroup?.get('currentPassword')?.value,
      newPassword: this.formComponent?.formGroup?.get('newPassword')?.value,
    };

    this.authService.changePassword(changePassword).subscribe({
      next: (res) => {
        if (res.statusCode === 400 || res.statusCode === 404) {
          this.confirmService.showMessage('error', 'Error', res.message);
        }

        if (res.statusCode === 200 || res.statusCode === 201) {
          this.confirmService.showMessage('info', 'Exito', res.message);
          localStorage.setItem('isNewUser', 'false');
        }
      },
      error: (err) => {
        console.error(err.error.message);
        this.confirmService.showMessage('error', 'Error', err.error.message);
      },
      complete: () => {
        this.isDisplayChangePassword = false;
        this.loadingService.hide();
        this.formComponent?.formGroup?.reset();
      },
    });
  }

}
