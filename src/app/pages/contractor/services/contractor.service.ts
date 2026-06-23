import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Contractor } from '../interfaces/contractor.interface';
import { Response } from '../../../shared/interface/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContractorService extends BaseService<Contractor, Response<Contractor>> {
  constructor(http: HttpClient) {
    super(http, 'contractor');
  }
}

