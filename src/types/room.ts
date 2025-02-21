export interface Room {
  id: string;
  name: string;
  capacity: number;
  status: 'disponible' | 'ocupada' | 'mantenimiento';
  location: string;
  features: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RoomEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  room: Room;
  user?: User;
}