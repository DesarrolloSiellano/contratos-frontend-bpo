import { Contract } from '../../contract/interfaces/contract.interface';

export interface Contractor {
    id: number;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    nom?: string;
    ape?: string;
    nombreReferente?: string;
    email?: string;
    tel?: string;
    celular?: string;
    genero?: string;
    direccion?: string;
    ciudad?: string;
    tipoDoc?: string;
    numeroDoc: string;
    ciudadExpedicion?: string;
    estado?: string;
    rol?: string;
    company: string;
    fechaNacimiento?: string;
    contratoVigente: boolean;
    contratos?: Contract[];
}