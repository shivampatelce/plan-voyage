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
}

export interface AddItinerary {
  itineraryId?: string;
  date: Date | string;
  place: string;
  category: string;
  time?: string;
  tripId: string;
}
