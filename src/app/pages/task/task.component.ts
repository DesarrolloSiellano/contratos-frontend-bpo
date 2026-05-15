import { Component } from '@angular/core';
import { CONTRACTS_FORM } from '../../shared/forms/contracts.form';
import { TASK_FORM } from '../../shared/forms/task.form';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FormTemplateComponent } from '../../shared/components/form-template/form-template.component';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [Button, Dialog, FormTemplateComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  formTask = TASK_FORM;
  isEditForm = true;
  openDialogPrueba: any;
  isDisplayForm: any;
  titleForm: any;
  isFormVisible: any;

  initialData: any;

  save() {
    throw new Error('Method not implemented.');
  }
  closeDialog() {
    throw new Error('Method not implemented.');
  }
}
