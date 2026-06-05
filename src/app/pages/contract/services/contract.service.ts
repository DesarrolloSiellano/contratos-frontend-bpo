import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { BaseService } from "../../../shared/services/base.service";
import { Response } from "../../../shared/interface/response.interface";
import { Contract } from "../interfaces/contract.interface";

@Injectable({
    providedIn: 'root'
})
export class ContractService extends BaseService<Contract, Response<Contract>> {
    constructor(http: HttpClient) {
        // CAMBIADO A SINGULAR: Conecta directo con el endpoint del Backend
        super(http, 'Contract'); 
    }
}

