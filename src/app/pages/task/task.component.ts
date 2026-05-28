import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TASK_FORM } from '../../shared/forms/task.form';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';
import { TaskService } from './services/task.service';
import { ChangeDetectorRef } from '@angular/core';
import { DataLoaderService } from '../../shared/services/data-load.service';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';
import { Table } from 'primeng/table';
import { BaseCrud } from '../../shared/helpers/base-crud';
import { Task } from './interfaces/task.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [Button, Dialog, FormTemplateComponent, ListTemplateComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent extends BaseCrud<Task> implements OnInit, AfterViewInit {
  formTask = TASK_FORM;

  openDialogPrueba() {
throw new Error('Method not implemented.');
}
  cols = [
    { field: 'nom', header: 'Nombres' },
    { field: 'ape', header: 'Apellidos' },
    { field: 'email', header: 'Email' },
    { field: 'telefono', header: 'Telefono' },
    { field: 'celular', header: 'Celular' },
    { field: 'genero', header: 'Genero' },
    { field: 'direccion', header: 'Direccion' },
  ];

  ForTask = TASK_FORM;
  override isFormVisible = true;
  

  constructor(

    protected override service: TaskService,
    protected override cdr: ChangeDetectorRef,
    protected override dataLoader: DataLoaderService,
    protected override excelexport: ExcelExportService,
    protected override confirmService: ConfirmService,
  ) 
{
    super(service, cdr, dataLoader, excelexport, confirmService);
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}


