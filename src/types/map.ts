export interface Pin {
  id?: string;
  title: string;
  description: string;
  category: 'landmark' | 'food' | 'hidden' | 'activity';
  lat: number;
  lng: number;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface MapPosition {
  lat: number;
  lng: number;
}