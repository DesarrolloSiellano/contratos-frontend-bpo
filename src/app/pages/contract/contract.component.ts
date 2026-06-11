import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import { BaseCrud } from '../../shared/helpers/base-crud';
import { Contract } from './interfaces/contract.interface';
import { ContractService } from './services/contract.service';
import { ContractorService } from '../contractor/services/contractor.service';

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
  imports: [
    ListTemplateComponent,
    FormTemplateComponent,
    Button,
    Dialog
  ],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent extends BaseCrud<Contract> implements OnInit, AfterViewInit {

  @ViewChild(FormTemplateComponent)
  formTemplateComponent!: FormTemplateComponent;

  cols = [
    { field: 'numeroContrato', header: 'Número de Contrato' },
    { field: 'cargo', header: 'Cargo' },
    { field: 'periodoInicio', header: 'Fecha Inicio' },
    { field: 'periodoFin', header: 'Fecha Fin' },
    { field: 'estado', header: 'Estado' }
  ];

  formContract = CONTRACT_FORM;

  override isFormVisible = true;

  constructor(
    protected override service: ContractService,
    protected override cdr: ChangeDetectorRef,
    protected override dataLoader: DataLoaderService,
    protected override excelexport: ExcelExportService,
    protected override confirmService: ConfirmService,
    private contractorService: ContractorService
  ) {
    super(
      service,
      cdr,
      dataLoader,
      excelexport,
      confirmService
    );
  }

  ngOnInit(): void {
    this.cargarAutoselectContratistas();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  private cargarAutoselectContratistas(): void {
    const servicioDinamico = this.contractorService as any;

    if (servicioDinamico.findByPage) {
      servicioDinamico.findByPage(0, 100, '', '{}').subscribe({
        next: (res: any) => {
          const listaContratistas =
            res?.data ||
            res?.results ||
            (Array.isArray(res) ? res : []);

          const campoContratista = this.formContract.find(
            (c: any) => c.name === 'numeroDocContratista'
          );

          if (campoContratista && listaContratistas.length > 0) {
            campoContratista.type = 'select';
            campoContratista.optionName = 'label';
            campoContratista.optionValue = 'value';

            campoContratista.options = listaContratistas.map((c: any) => ({
              label: `${c.nom || ''} ${c.ape || ''} - C.C. ${c.numeroDoc || 'Sin Cédula'}`,
              value: c.id
            }));

            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {
          console.error(
            'Error cargando contratistas para Autoselect:',
            err
          );
        }
      });
    }
  }

  override save(): void {
    let datosForm: any = {};

    if (
      this.formTemplateComponent &&
      this.formTemplateComponent.formGroup
    ) {
      datosForm = this.formTemplateComponent.formGroup.value;
    } else {
      this.formContract.forEach((campo: any) => {
        datosForm[campo.name] = campo.value || '';
      });
    }

    const datosLimpiosBackend = {
      contratistaId: datosForm.numeroDocContratista || '',
      documentoContratista: datosForm.documentoContratista || 'cc',
      numeroContrato: datosForm.numeroContrato || '',
      nombreReferente: datosForm.nombreReferente || '',
      cargo: datosForm.cargo || '',
      periodoInicio: datosForm.periodoInicio || null,
      periodoFin: datosForm.periodoFin || null,
      responsableSupervisor: datosForm.responsableSupervisor || '',
      subsecretarias: datosForm.subsecretarias || '',
      descripcionObligacion: datosForm.descripcionObligacion || '',
      actividadEstrategica: datosForm.actividadEstrategica || '',
      descripcionMeta: datosForm.descripcionMeta || '',
      metaCuantitativa: datosForm.metaCuantitativa || '',
      unidad: datosForm.unidad || '',
      metaTrimestre: datosForm.metaTrimestre || '',
      metaPorcentajeTrimestre: datosForm.metaPorcentajeTrimestre || '',
      completado: !!datosForm.completado,
      vigente: !!datosForm.vigente,
      detenido: !!datosForm.detenido,
      estado: datosForm.estado || 'activo',
      porcentajeTotal: datosForm.porcentajeTotal || '0'
    } as Contract;

    if (this.isEditForm) {

      const idEditar =
        (this as any).initialData?.id ||
        (this as any).id;

      this.service.update(idEditar, datosLimpiosBackend).subscribe({
        next: () => this.finalizarGuardadoExitoso(),
        error: (err: any) => {
          console.error(
            'Error al actualizar contrato:',
            err
          );
        }
      });

    } else {

      this.service.create(datosLimpiosBackend).subscribe({
        next: (respuesta: any) => {
          console.log(
            'Contrato guardado con éxito:',
            respuesta
          );

          this.finalizarGuardadoExitoso();
        },

        error: (err: any) => {
          if (
            err.status === 200 ||
            err.status === 201 ||
            err.status === 0
          ) {
            this.finalizarGuardadoExitoso();
          } else {
            console.error(
              'Error de validación en contratos:',
              err
            );

            this.finalizarGuardadoExitoso();
          }
        }
      });

    }
  }

  private finalizarGuardadoExitoso(): void {
    (this as any).isDisplayForm = false;

    this.isFormVisible = false;

    try {
      this.rechargeTable();
    } catch {
      if ((this as any).load) {
        (this as any).load({});
      }
    }

    setTimeout(() => {
      this.isFormVisible = true;
      this.cdr.detectChanges();
    }, 50);
  }
}

