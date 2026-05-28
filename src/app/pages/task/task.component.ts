import { Component } from '@angular/core';
import { CONTRACTS_FORM } from '../../shared/forms/contracts.form';
import { TASK_FORM } from '../../shared/forms/task.form';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';
import { ListTemplateComponent } from '../../shared/components/list-template/list-template.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [Button, Dialog, FormTemplateComponent, ListTemplateComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  formTask = TASK_FORM;
  isEditForm = true;
  openDialogPrueba: () => void = () => { this.isDisplayForm = true; };
  isDisplayForm = false;
  titleForm = 'Formulario';
  isFormVisible = true;
  initialData: any = {};

  // Propiedades para app-list-template
  toAdd = false;
  options = true;
  cols: any[] = [];
  data: any[] = [];
  totalRecords = 0;
  loading = false;
  filtersGlobal: boolean = true;

  formContract: any = CONTRACTS_FORM;

  // Métodos para app-list-template
  load(event: any) {
    console.log('loadLazy event:', event);
  }

  queryDate(event: any) {
    console.log('dateQuery event:', event);
  }

  update(event: any) {
    console.log('update event:', event);
  }

  delete(event: any) {
    console.log('delete event:', event);
  }

  exportAsXLSX() {
    console.log('exportPage');
  }

  rechargeTable() {
    console.log('reload');
  }

  onSelectionChange(event: any) {
    console.log('onRowSelectionChange:', event);
  }

  save() {
    console.log('save');
  }

  closeDialog() {
    this.isDisplayForm = false;
  }
}
