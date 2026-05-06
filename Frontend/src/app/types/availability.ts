

export type AvalabilityBlockType = 'Working' | 'Blocked' | 'Closed';

export interface AppointmentAvalabilityBlock {
    id: number;
    date: string;
    startTime?: string;
    endTime?: string;
    notes?:string;
    type: AvalabilityBlockType;
    isActive: boolean
}

export interface AppointmentAvailabilityQueryParams{
    pageNumber?: number;
    pageSize?: number;
    fromDate?: string | null;
    toDate?: string | null;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface AppointmentAvailabilityFormValue{
    date: string;
    startTime?: string | null;
    endTime?: string | null;
    notes?:string | null;
    type: AvalabilityBlockType;
    isActive: boolean
}