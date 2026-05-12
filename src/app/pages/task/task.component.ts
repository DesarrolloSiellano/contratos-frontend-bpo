import { Component } from '@angular/core'; 
import { CONTRACTS_FORM } from '../../shared/forms/contracts.form';
import { TASK_FORM } from '../../shared/forms/task.form';
import { Button } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { FormTemplateComponent } from "../../shared/components/form-template/form-template.component";
   @Component ({
     selector: 'app-task',
     standalone: true,
     imports: [Button, Dialog, FormTemplateComponent],
     templateUrl: './task.component.html',
     styleUrl: './task.component.css'
      }),

  
formTask = TASK_FORM;
override isEditForm = true;



      export class TaskComponent {
save() {
throw new Error('Method not implemented.');
}
closeDialog() {
throw new Error('Method not implemented.');
}
openDialogPrueba: any;
isDisplayForm: any;
titleForm: any;
isFormVisible: any;
formTask: any[] | 
isEditForm: boolean: any;
initialData: any;

      }

 
      