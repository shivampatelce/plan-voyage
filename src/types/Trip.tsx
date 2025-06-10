export interface Trip {
  tripId: number;
  destination: string;
  startDate: Date;
  endDate: Date;
  destinationImageUrl: string;
  status: string;
}

export interface CreateTripRequest {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  userId: string;
}
