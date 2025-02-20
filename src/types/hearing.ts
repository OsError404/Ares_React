export type HearingType = 'Transito' | 'Otros';

export interface Participant {
  id: string;
  name: string;
  documentId: string;
  entityType: 'natural' | 'juridico';
  email: string;
  role: 'convocado' | 'convocador' | 'conciliador';
}

export interface HearingFormData {
  type: HearingType;
  date: string;
  hearingDateTime: string;
  claimAmount: number;
  vehicleCount: number;
  address: string;
  department: string;
  city: string;
  description: string;
  participants: Participant[];
}