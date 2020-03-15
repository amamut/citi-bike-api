import { ObjectID } from "mongodb";

export interface CitiBikeLocation {
    id: number;
    stationName: string;
    availableDocks: number;
    totalDocks: number;
    latitude: number;
    longitude: number;
    statusValue: string;
    statusKey: number;
    availableBikes: number;
    stAddress1: string;
    stAddress2: string;
    city: string;
    postalCode: string;
    location: string;
    altitude: string;
    testStation: boolean;
    lastCommunicationTime: string;
    landMark: string;
}

export interface CitiBikeLocationDB extends CitiBikeLocation {
    _id: ObjectID;
}

export interface CitiBikeLocationResponse {
    executionTime: string;
    stationBeanList: CitiBikeLocation[];
}

export interface StationResponse<T> {
    data: T[];
    token?: string;
    offset?: number;
    limit?: number;
}

export interface Dockable {
    dockable: boolean;
    message: string;
}
export interface DockableResponse {
    data: Dockable;
    stationId: number;
    bikesToReturn: number;
}

export type CitiBikeLocationItem = Pick<
    CitiBikeLocation,
    "id" | "stationName" | "stAddress1" | "stAddress2" | "availableBikes" | "totalDocks"
>;

export function createDBLocation(loc: CitiBikeLocation) {
    return {
        _id: new ObjectID(),
        ...loc,
    } as CitiBikeLocationDB;
}

export function createAPILocation(loc: CitiBikeLocationDB) {
    const { id, stationName, stAddress1, stAddress2, availableBikes, totalDocks } = loc;
    return {
        id,
        stationName,
        stAddress1,
        stAddress2,
        availableBikes,
        totalDocks,
    } as CitiBikeLocationItem;
}
