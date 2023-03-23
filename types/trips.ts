export type Trip = {
    agencyId: string;
    agencyName: string;
    description: string | null;
    destinationAddress: string;
    destinationLatitude: number;
    destinationLongitude: number;
    endDateTime: Date;
    id: string;
    originAddress: string;
    originLatitude: number;
    originLongitude: number;
    personelId: string | null;
    price: number;
    startDateTime: Date;
    status: number;
    subscriberID: string | null;
    commission: number;
};
export type TripWithoutPriceAndCommission = Omit<Trip, 'price' | 'commission'>;
export type ExtendedTrip = TripWithoutPriceAndCommission & {
    cost: number;
    income: number;
    agencyName: string;
};