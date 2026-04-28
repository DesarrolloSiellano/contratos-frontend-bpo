import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { Contractor } from './interfaces/contractor.interface';
import { ContractorService } from './services/contractor.service';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [],
  templateUrl: './contractor.component.html',
  styleUrl: './contractor.component.scss'
})
export class ContractorComponent extends BaseCrud<Contractor> {

    constructor(
        protected override service: ContractorService,
        protected override cdr: ChangeDetectorRef,
        protected override dataLoader: DataLoaderService,
        protected override excelexport: ExcelExportService,
        protected override confirmService: ConfirmService

    ) {
        super(service, cdr, dataLoader, excelexport, confirmService);
    }

}
