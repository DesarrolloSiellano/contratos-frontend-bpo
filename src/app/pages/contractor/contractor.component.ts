import { ChangeDetectorRef, Component, signal, OnInit, AfterViewInit } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { Contractor } from './interfaces/contractor.interface';
import { ContractorService } from './services/contractor.service';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [ListTemplateComponent,FormTemplateComponent],
  templateUrl: './contractor.component.html',
  styleUrl: './contractor.component.scss',
})
export class ContractorComponent extends BaseCrud<Contractor> implements OnInit, AfterViewInit {
  cols = [
    { field: 'nom', header: 'Nombres' },
    { field: 'ape', header: 'Apellidos' },
    { field: 'email', header: 'Email' },
    { field: 'tel', header: 'Telefono' },
    { field: 'celular', header: 'Celular' },
    { field: 'genero', header: 'Genero' },
    { field: 'direccion', header: 'Direccion' },
  ];

  showModal = signal<boolean>(false);

  constructor(
    protected override service: ContractorService,
    protected override cdr: ChangeDetectorRef,
    protected override dataLoader: DataLoaderService,
    protected override excelexport: ExcelExportService,
    protected override confirmService: ConfirmService,
  ) {
    super(service, cdr, dataLoader, excelexport, confirmService);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { 
    this.cdr.detectChanges();
   }
}
