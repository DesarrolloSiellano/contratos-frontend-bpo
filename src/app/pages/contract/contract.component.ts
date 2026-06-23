import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { Contract } from './interfaces/contract.interface';
import { ContractService } from './services/contract.service';
import { ContractorService } from '../contractor/services/contractor.service';
import { Contractor } from '../contractor/interfaces/contractor.interface';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';
import { CONTRACT_FORM } from '../../shared/forms/contract.form';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [ListTemplateComponent, FormTemplateComponent, Button, Dialog],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent extends BaseCrud<Contract> implements OnInit, AfterViewInit {
  @ViewChild(FormTemplateComponent)
  formTemplateComponent!: FormTemplateComponent;

  cols = [
    { field: 'numeroContrato', header: 'Número de Contrato' },
    { field: 'periodoInicio', header: 'Fecha Inicio' },
    { field: 'periodoFin', header: 'Fecha Fin' },
    { field: 'estado', header: 'Estado' },
    { field: 'contratistaId', header: 'Contratista' },
    { field: 'valorTotalContrato', header: 'Valor Total' },
  ];

  formContract: any[] = [];
  listaContratistas: Contractor[] = [];
  listaSupervisores: any[] = [];

  constructor(
    protected override service: ContractService,
    protected override cdr: ChangeDetectorRef,
    protected override dataLoader: DataLoaderService,
    protected override excelexport: ExcelExportService,
    protected override confirmService: ConfirmService,
    private contractorService: ContractorService
  ) {
    super(service, cdr, dataLoader, excelexport, confirmService);
  }

  ngOnInit(): void {
    this.formContract = CONTRACT_FORM;
    this.cargarAutoselectContratistas();
    this.cargarSupervisores();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  override create(): void {
    this.isEditForm = false;
    this.initialData = null as any;
    this.isDisplayForm = true;
    this.isFormVisible = true;
    this.titleForm = 'Crear contrato';
    this.cdr.detectChanges();
  }

  override update(event: any): void {
    this.isEditForm = true;
    this.initialData = event;
    this.isDisplayForm = true;
    this.isFormVisible = true;
    this.titleForm = 'Editar contrato';
    this.formContract = CONTRACT_FORM;
    this.cargarDatosEnFormulario(event);
    this.cdr.detectChanges();
  }

  override closeDialog(): void {
    this.isDisplayForm = false;
    this.isFormVisible = false;
    this.initialData = null as any;
    this.isEditForm = false;
  }

  private cargarAutoselectContratistas(): void {
    this.contractorService.findByPage(0, 100, '', '{}').subscribe({
      next: (res: any) => {
        let lista: Contractor[] = [];

        if (res?.data && Array.isArray(res.data)) {
          lista = res.data;
        } else if (res?.results && Array.isArray(res.results)) {
          lista = res.results;
        } else if (res?.docs && Array.isArray(res.docs)) {
          lista = res.docs;
        } else if (Array.isArray(res)) {
          lista = res;
        }

        this.listaContratistas = lista;

        const campo = this.formContract.find((c: any) => c.name === 'numeroDocContratista');
        if (campo) {
          campo.type = 'select';
          campo.optionName = 'label';
          campo.optionValue = 'value';
          campo.options = lista.map((c: Contractor) => ({
            label: `${c.nom || ''} ${c.ape || ''} - C.C. ${c.numeroDoc || 'Sin Cédula'}`,
            value: String(c.id),
          }));
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error cargando contratistas:', err);
        const campo = this.formContract.find((c: any) => c.name === 'numeroDocContratista');
        if (campo) campo.options = [];
        this.cdr.detectChanges();
      },
    });
  }

  private cargarSupervisores(): void {
    this.listaSupervisores = [
      { id: '1', nom: 'Supervisor 1', ape: 'Apellido 1', estado: 'activo' },
      { id: '2', nom: 'Supervisor 2', ape: 'Apellido 2', estado: 'activo' },
    ];

    const campo = this.formContract.find((c: any) => c.name === 'idSupervisor');
    if (campo && this.listaSupervisores.length > 0) {
      campo.type = 'select';
      campo.optionName = 'label';
      campo.optionValue = 'value';
      campo.options = this.listaSupervisores.map((s: any) => ({
        label: `${s.nom || ''} ${s.ape || ''}`,
        value: s.id,
      }));
      this.cdr.detectChanges();
    }
  }

  private cargarDatosEnFormulario(event: any): void {
    this.formContract.forEach((campo: any) => {
      const valor = event[campo.name];
      if (valor !== undefined && valor !== null) {
        campo.value = valor;
      }
    });
    this.cdr.detectChanges();
  }

  override save(): void {
    const form = this.formTemplateComponent?.formGroup;
    if (!form) {
      this.confirmService.showMessage('error', 'Error', 'El formulario no está disponible');
      return;
    }

    const datosForm = form.getRawValue();

    if (!datosForm.numeroContrato || datosForm.numeroContrato.length < 2) {
      this.confirmService.showMessage('error', 'Validación', 'El número de contrato es obligatorio');
      return;
    }

    if (
      datosForm.numeroDocContratista === null ||
      datosForm.numeroDocContratista === undefined ||
      datosForm.numeroDocContratista === ''
    ) {
      this.confirmService.showMessage('error', 'Validación', 'Debe seleccionar un contratista');
      return;
    }

    if (
      datosForm.idSupervisor === null ||
      datosForm.idSupervisor === undefined ||
      datosForm.idSupervisor === ''
    ) {
      this.confirmService.showMessage('error', 'Validación', 'Debe seleccionar un supervisor');
      return;
    }

    const fechaInicio = datosForm.periodoInicio ? new Date(datosForm.periodoInicio) : null;
    const fechaFin = datosForm.periodoFin ? new Date(datosForm.periodoFin) : null;

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      this.confirmService.showMessage('error', 'Validación', 'La fecha de inicio debe ser menor o igual a la fecha de fin');
      return;
    }

    const valorTotal = parseFloat(datosForm.valorTotalContrato) || 0;
    const valorPeriodos = parseFloat(datosForm.valorParaPeriodos) || 0;

    if (valorTotal !== valorPeriodos) {
      this.confirmService.showMessage(
        'error',
        'Validación',
        `El valor para periodos (${valorPeriodos}) debe igualar el valor total del contrato (${valorTotal})`
      );
      return;
    }

    const payload: Contract = {
      id: datosForm.id || undefined,
      numeroContrato: datosForm.numeroContrato,
      contratistaId: String(datosForm.numeroDocContratista),
      idSupervisor: datosForm.idSupervisor,
      periodoInicio: datosForm.periodoInicio || null,
      periodoFin: datosForm.periodoFin || null,
      valorTotalContrato: datosForm.valorTotalContrato,
      numeroPeriodo: datosForm.numeroPeriodo,
      valorParaPeriodos: datosForm.valorParaPeriodos,
      estado: 'vigente',
      completado: false,
      vigente: true,
      prorrogado: false,
      detenido: false,
      porcentajeTotal: 0,
      porcentajeRestante: 100,
    };

    if (this.isEditForm) {
      const idEditar = (this.initialData as any)?.id;
      if (!idEditar) {
        this.confirmService.showMessage('error', 'Error', 'No se encontró el ID del contrato');
        return;
      }

      this.service.update(idEditar, payload).subscribe({
        next: () => this.finalizarGuardadoExitoso(),
        error: (err: any) => {
          console.error('Error al actualizar contrato:', err);
          this.confirmService.showMessage('error', 'Error', err.error?.message || 'No se pudo actualizar el contrato');
        },
      });
      return;
    }

    this.service.create(payload).subscribe({
      next: () => this.finalizarGuardadoExitoso(),
      error: (err: any) => {
        console.error('Error al crear contrato:', err);
        this.confirmService.showMessage('error', 'Error', err.error?.message || 'No se pudo guardar el contrato');
      },
    });
  }

  private finalizarGuardadoExitoso(): void {
    this.isDisplayForm = false;
    this.isFormVisible = false;
    this.rechargeTable();
    this.cdr.detectChanges();
  }
}

