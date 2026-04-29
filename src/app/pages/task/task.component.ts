import { Component } from '@angular/core'; 
   @Component ({
     selector: 'app-task',
     standalone: true,
     imports: [],
     templateUrl: './task.component.html',
     styleUrl: './task.component.css'
      })

      export class TaskComponent {

      }

export class Task {

    //tslint:disable-next-line: variable-name
    _id: any;
    idcontrato: any;
    estado: any;
    tarea: any;
    subsecretarias: any;
    dimensiones: any;
    responsables: any;
    fechaInicio: any;
    fechaFinalizacion: any;
    evidencia: any;
    comuna: any;
    tipoPoblacionImpactada: any;
    CantidadPoblacionImpactada: any;
    diasSemana: any;
    PorcentajeAvanceProgramado: any;
    PorcentajeAvanceAlcanzado: any;
    observaciones: any;
    PorcentajeAvanceProgramadoAcumulado: any;
    PorcentajeAvanceNoAlcanzadoAcumulado: any;


}
