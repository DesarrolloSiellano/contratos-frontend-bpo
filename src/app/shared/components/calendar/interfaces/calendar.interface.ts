export interface Event {
    _id: string;
    title: string;
    description?: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    location?: string;
    type?: 'PRESENCIAL' | 'VIRTUAL';
    link?: string;
    assignedLeaderIds: any[]; // IDs of Multilevel nodes (Leaders or intermediate)
    company: string;
    campaign?: any;
    status?: 'PROGRAMADO' | 'COMPLETADO' | 'CANCELADO';
    createdDate: string;
    createdHour: string;
    idUserCreation: string;
}


export interface CalendarCategory {
    id: string;
    name: string;
    color: string;
    icon?: string;
    count?: number;
    selected?: boolean;
}

export interface CalendarEvent extends Event {
    categoryColor?: string;
    gridPosition?: {
        startRow: number;
        endRow: number;
        column: number;
    };
}

export type CalendarViewType = 'day' | 'week' | 'weekdays' | 'month';

export interface CalendarState {
    currentDate: Date;
    viewType: CalendarViewType;
    selectedCategories: string[];
}
