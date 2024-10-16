export interface StationGetStationsOutputDTO {
    stationId: bigint;
    stationName: string;
    role: string;
    address: string;
    longitude: number;
    latitude: number;
    isActive: boolean;
}