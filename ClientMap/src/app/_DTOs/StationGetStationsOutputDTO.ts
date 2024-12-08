export interface StationGetStationsOutputDTO {
    stationId: bigint;
    stationName: string;
    username: string;
    role: string;
    address: string;
    longitude: number;
    latitude: number;
    isActive: boolean;
}