import type { IStripPool, IStripPoolMember, IStripPoolMutation } from './pools_api';

export interface IPoolsApi {
  getPools(): Promise<IStripPool[]>;
  getPool(uuid: string): Promise<IStripPool>;
  createPool(data: IStripPoolMutation): Promise<string>;
  updatePool(uuid: string, data: Partial<IStripPoolMutation>): Promise<void>;
  updatePoolMembers(uuid: string, members: IStripPoolMember[]): Promise<void>;
  deletePool(uuid: string): Promise<void>;
}
