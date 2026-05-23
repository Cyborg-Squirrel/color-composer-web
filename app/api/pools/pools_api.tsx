import type { BlendMode } from "../strips/strips_api";

export type PoolType = 'Sync' | 'Unified';
export const poolTypes: PoolType[] = ['Sync', 'Unified'];

export interface IStripPoolMember {
    uuid?: string;       // server-assigned; omit/undefined for newly added members
    stripUuid: string;
    inverted: boolean;
    poolIndex: number;   // ordering within the pool
    inUse: Boolean;
}

export interface IStripPool {
    uuid: string;
    name: string;
    poolType: PoolType;
    blendMode: BlendMode;
    members: IStripPoolMember[];
    inUse: Boolean;
}

export interface IStripPoolMutation {
    name: string;
    poolType: PoolType;
    blendMode?: BlendMode;
}

export type { IPoolsApi } from './pools_api.interface';
export { MockPoolsApi } from './pools_api.mock';
export { RealPoolsApi } from './pools_api.real';

