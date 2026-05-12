import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response } from "../../../shared/interface/response.interface"; 
import { Task } from "../interfaces/task.interface";
import { BaseService } from "../../../shared/services/base.service";

@Injectable({

    providedIn: 'root'

})
export class TaskService extends BaseService<Task, Response<Task>> {

        constructor(http: HttpClient) {
            super(http, 'task');
        }

    }
    

    