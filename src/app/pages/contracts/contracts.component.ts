import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ContractsService } from './services/contacts.service';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { Contract } from './interfaces/contract.interface';
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [ListTemplateComponent],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
})
export class ContractsComponent extends BaseCrud<Contract> implements OnInit,AfterViewInit {
  cols = [
    { field: 'nom', header: 'Nombres' },
    { field: 'ape', header: 'Apellidos' },
    { field: 'email', header: 'Email' },
    { field: 'telefono', header: 'Telefono' },
    { field: 'celular', header: 'Celular' },
    { field: 'genero', header: 'Genero' },
    { field: 'direccion', header: 'Direccion' },
  ];

  constructor(
    protected override service: ContractsService,
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
}
