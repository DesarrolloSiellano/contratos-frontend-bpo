export interface Contract {
  id?: string;
  numeroContrato: string;
  contratistaId: string;
  idSupervisor: string;
  periodoInicio: Date | string | null;
  periodoFin: Date | string | null;
  valorTotalContrato: string;
  numeroPeriodo: string;
  valorParaPeriodos: string;
  estado: 'vigente' | 'prorrogado' | 'detenido' | 'completado' | string;
  completado: boolean;
  vigente: boolean;
  prorrogado: boolean;
  detenido: boolean;
  porcentajeTotal?: number;
  porcentajeRestante?: number;
}

