import { Contractor } from '../../contractor/interfaces/contractor.interface';

export interface Contract {
    id: string;
    idSupervisor?: string;
    documentoContratista?: string;
    numeroDocContratista: string; 
    ano?: string;
    numeroContrato: string;
    nombreReferente?: string;
    cargo?: string;
    periodoInicio?: string;
    periodoFin?: string;
    responsableSupervisor?: string;
    subsecretarias?: string;
    descripcionObligacion?: string;
    actividadEstrategica?: string;
    descripcionMeta?: string;
    metaCuantitativa?: string;
    unidad?: string;
    metaTrimestre?: string;
    metaPorcentajeTrimestre?: string;
    completado: boolean;
    vigente: boolean;
    prorrogrado: boolean;
    detenido: boolean;
    estado?: string;
    porcentajeTotal?: string;
    porcentajeRestante?: string;
    valorTotalContrato?: string;
    numeroPeriodo?: string;
    valorParaPeriodos?: string;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    contratistaId: number;
    contratista?: Contractor;
}
