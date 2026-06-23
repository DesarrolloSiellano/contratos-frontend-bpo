import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Contract } from '../interfaces/contract.interface';
import { Response } from '../../../shared/interface/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContractService extends BaseService<Contract, Response<Contract>> {
  constructor(http: HttpClient) {
    super(http, 'contracts');
  }
}
