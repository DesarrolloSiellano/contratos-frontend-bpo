import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { BaseService } from "../../../shared/services/base.service";

import { Response } from "../../../shared/interface/response.interface";
import { Contract } from "../interfaces/contract.interface";

@Injectable({
    providedIn: 'root'
})
export class ContractsService extends BaseService<Contract, Response<Contract>> {

    constructor(http: HttpClient) {
        super(http, 'contracts');
    }

}