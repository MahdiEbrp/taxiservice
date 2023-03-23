type Agency = {
    agencyName: string;
};
export type AgencyList = Agency[];

export type AgencyData = {
    id: string;
    agencyName: string;
    isEnable: boolean;
    phoneNumber1: string;
    phoneNumber2: string;
    mobileNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    workingDays: number;
    commissionRate: number;
    currencySymbol: string;
    startOfWorkingHours: Date;
    endOfWorkingHours: Date;
    createdAt: Date;
};
export type AgencyDataList = AgencyData[];