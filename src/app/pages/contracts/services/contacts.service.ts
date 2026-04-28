import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { BaseService }from  "../../../shared/services/base.service"; 
import { Contracts } from  "../interfaces/contracts.interface";
import { Response } from "../../../shared/interface/response.interface"; 

@Injectable({
    providedIn: 'root'
})
export class ContractsService extends BaseService<Contracts, Response<Contracts>> {

    constructor(http: HttpClient) {
        super(http, 'contracts');
    }

}