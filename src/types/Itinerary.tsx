export interface Itinerary {
  itineraryId?: string;
  date: Date | string;
  itineraryPlaces?: Place[];
}

export interface Place {
  id?: string;
  place: string;
  category: string;
  time?: string;
  coordinates?: Coordinates;
  notes?: string;
}

export interface Coordinates {
  id: string;
  latitude: number;
  longitude: number;
  place?: string;
  placeNumber?: number;
}

export interface AddItinerary {
  itineraryId?: string;
  date: Date | string;
  place: string;
  category: string;
  time?: string;
  tripId: string;
}
