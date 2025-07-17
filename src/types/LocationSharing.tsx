import type { TripUsers } from './Trip';

export default interface LocationInformation {
  position: { latitude: number; longitude: number };
  userId: string;
  userInfo?: TripUsers;
}
