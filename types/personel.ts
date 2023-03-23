export type PersonelList = PersonelData[];

export type PersonelData = {
    agencyId: string;
    agencyName: string;
    canDrive: boolean;
    canSeeReports: boolean;
    canSeeRequests: boolean;
    id: string;
    isEnable: boolean;
    isManager: boolean;
    isRequest: boolean;
    name: string;
    position: string;
    profilePicture: string;
    userId: string;
};