import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ContractsService } from './services/contacts.service';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { Contract } from './interfaces/contract.interface';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss'
})
export class ContractsComponent extends BaseCrud<Contract> {

  constructor(
    protected override service: ContractsService,
    protected override cdr: ChangeDetectorRef,
    protected override dataLoader: DataLoaderService,
    protected override excelexport: ExcelExportService,
    protected override confirmService: ConfirmService

  ) {

    super(service, cdr, dataLoader, excelexport, confirmService);
  }



}
