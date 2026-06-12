import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { Contractor } from './interfaces/contractor.interface';
import { ContractorService } from './services/contractor.service';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';
import { CONTRACTOR_FORM } from '../../shared/forms/contractor.form';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-contractor',
  standalone: true,
  imports: [ListTemplateComponent, FormTemplateComponent, ButtonModule, DialogModule],
  templateUrl: './contractor.component.html',
  styleUrl: './contractor.component.scss',
})
export class ContractorComponent extends BaseCrud<Contractor> implements OnInit, AfterViewInit {
  @ViewChild(FormTemplateComponent) formTemplateComponent!: FormTemplateComponent;

  cols = [
    { field: 'nom', header: 'Nombres' },
    { field: 'ape', header: 'Apellidos' },
    { field: 'email', header: 'Email' },
    { field: 'tel', header: 'Teléfono' },
    { field: 'celular', header: 'Celular' },
    { field: 'genero', header: 'Género' },
    { field: 'direccion', header: 'Dirección' },
    { field: 'numeroDoc', header: 'Número de Documento' },
    { field: 'tipoDoc', header: 'Tipo de Documento' },
  ];

  formContractor = CONTRACTOR_FORM;

  constructor(
    protected override service: ContractorService,
    protected override cdr: ChangeDetectorRef,
    protected override dataLoader: DataLoaderService,
    protected override excelexport: ExcelExportService,
    protected override confirmService: ConfirmService,
  ) {
    super(service, cdr, dataLoader, excelexport, confirmService);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  override save(): void {
    let datosForm: any = {};

    if (this.formTemplateComponent && this.formTemplateComponent.formGroup) {
      datosForm = this.formTemplateComponent.formGroup.value;
    }

    // Validación de email
    let emailLimpio = datosForm.email ? datosForm.email.toString().trim().toLowerCase() : '';
    if (!emailLimpio || !emailLimpio.includes('@')) {
      this.confirmService.showMessage(
        'error',
        'Validación',
        'El correo es inválido'
      );
      return;
    }

    // Validación de número de documento
    if (!datosForm.numeroDoc || datosForm.numeroDoc.length < 5) {
      this.confirmService.showMessage(
        'error',
        'Validación',
        'El número de documento es obligatorio y debe tener mínimo 5 caracteres'
      );
      return;
    }

    const datosLimpiosBackend: Contractor = {
      nom: datosForm.nom || '',
      ape: datosForm.ape || '',
      nombreReferente: datosForm.nombreReferente || '',
      email: emailLimpio,
      tel: datosForm.tel || '',
      celular: datosForm.celular || '',
      genero: datosForm.genero || '',
      direccion: datosForm.direccion || '',
      ciudad: datosForm.ciudad || '',
      tipoDoc: datosForm.tipoDoc || '',
      numeroDoc: datosForm.numeroDoc,
      ciudadExpedicion: datosForm.ciudadExpedicion || '',
      estado: datosForm.estado || 'activo',
      rol: datosForm.rol || 'contratista',
      fechaNacimiento: datosForm.fechaNacimiento || '',
      contratoVigente: false,
    };

    if (this.isEditForm) {
      const idEditar = (this.initialData as any)?.id;
      if (!idEditar) {
        this.confirmService.showMessage('error', 'Error', 'No se encontró el ID del contratista');
        return;
      }
      this.service.update(idEditar, datosLimpiosBackend).subscribe({
        next: () => this.finalizarGuardadoExitoso(),
        error: (err) => {
          console.error('Error al actualizar contratista:', err);
          this.confirmService.showMessage('error', 'Error', 'No se pudo actualizar el contratista');
        }
      });
    } else {
      this.service.create(datosLimpiosBackend).subscribe({
        next: (respuesta) => {
          console.log('Guardado con éxito:', respuesta);
          this.finalizarGuardadoExitoso();
        },
        error: (err) => {
          console.error('Error al guardar contratista:', err);
          this.confirmService.showMessage('error', 'Error', err.error?.message || 'No se pudo guardar el contratista');
        }
      });
    }
  }

  private finalizarGuardadoExitoso = (): void => {
    this.isDisplayForm = false;
    this.isFormVisible = false;
    this.rechargeTable();
    this.cdr.detectChanges();
  };
}

