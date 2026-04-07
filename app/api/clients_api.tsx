

export const colorOrders: ColorOrder[] = ["RGB", "GRB"];
export type ColorOrder = 'RGB' | 'GRB';

export const clientTypes: ClientType[] = ["Pi", "NightDriver"];
export const NightDriverType = 'NightDriver';
export const PiClientType = 'Pi';
export type ClientType = 'Pi' | 'NightDriver';

export interface ILedStripClient {
    name: string;
    address: string;
    uuid: string;
    clientType: ClientType;
    colorOrder: ColorOrder;
    apiPort: number;
    wsPort: number;
    lastSeenAt: number;
    status: ClientStatus;
    activeEffects: number;
    powerLimit: number | null;
}

export interface ILedStripClientMutation {
    name: string;
    address: string;
    clientType: ClientType;
    colorOrder: ColorOrder;
    apiPort: number;
    wsPort: number;
    powerLimit: number | null;
}

export const enum ClientStatus {
    SetupIncomplete = 'SetupIncomplete',
    Idle = 'Idle',
    Active = 'Active',
    Offline = 'Offline',
    Error = 'Error'
}

export type { IClientsApi } from './clients_api.interface';
export { MockClientsApi } from './clients_api.mock';
export { RealClientsApi } from './clients_api.real';

