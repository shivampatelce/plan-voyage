export interface Trip {
  tripId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  destinationImageUrl: string;
  status: string;
  creatorId: string;
  tripUsers: {
    userId: string;
  }[];
}

export interface CreateTripRequest {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  userId: string;
}
