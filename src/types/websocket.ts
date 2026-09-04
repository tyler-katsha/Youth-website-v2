import type { ConnectionType } from "./types";

export interface RawEvent {
    connectionType: ConnectionType;
    email: string;
    message: string;
    timestamp: string | number;
}
export interface TrafficPayload {
    event: RawEvent;
    currentSize: number;
    maxSize:number;
}
export interface ChartEvent extends RawEvent {
    time: string;
    typeValue: number;
}