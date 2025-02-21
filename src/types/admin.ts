export interface Company {
  id: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  type: 'aseguradora' | 'empresa';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  prefix: string;
  address: string;
  city: string;
  department: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  locationId: string;
  modality: 'presencial' | 'virtual';
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holiday {
  id: string;
  date: Date;
  description: string;
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Signature {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}