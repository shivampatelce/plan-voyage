export interface Trip {
  tripId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  destinationImageUrl: string;
  status: string;
  creatorId: string;
  tripUsers: TripUsers[];
}

export interface TripUsers {
id: string;
  firstName: string;
  lastName: string;
}

export interface CreateTripRequest {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  userId: string;
}
