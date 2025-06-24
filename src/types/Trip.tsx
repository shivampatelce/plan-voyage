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
  userId: string;
  firstName: string;
  lastName: string;
  // To represent different color for differenet users
  color?: string;
  badgeBgColor?: string;
}

export interface CreateTripRequest {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  userId: string;
}
