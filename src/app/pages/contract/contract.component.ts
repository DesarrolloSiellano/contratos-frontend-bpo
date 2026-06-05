import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ContractService } from './services/contract.service'; 
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { Contract } from './interfaces/contract.interface'; 
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';
import { CONTRACT_FORM } from '../../shared/forms/contract.form';
import { Button } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { FormTemplateComponent } from "../../shared/components/form-template/form-template.component";

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [ListTemplateComponent, Button, Dialog, FormTemplateComponent],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractsComponent extends BaseCrud<Contract> implements OnInit, AfterViewInit {
  
  cols = [
    { field: 'nom', header: 'Nombres' },
    { field: 'ape', header: 'Apellidos' },
    { field: 'email', header: 'Email' },
    { field: 'telefono', header: 'Telefono' },
    { field: 'celular', header: 'Celular' },
    { field: 'genero', header: 'Genero' },
    { field: 'direccion', header: 'Direccion' },
  ];

  formContract = CONTRACT_FORM;

  constructor(
    protected override service: ContractService, 
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

  override closeDialog(): void {
    this.isDisplayForm = false;
    this.isFormVisible = false;
  }
}

