import type { IStripPool, IStripPoolMember, IStripPoolMutation } from './pools_api';
import type { IPoolsApi } from './pools_api.interface';

export class MockPoolsApi implements IPoolsApi {
    private pools: IStripPool[] = [
        {
            uuid: 'pool-downstairs-0001',
            name: 'Downstairs',
            poolType: 'Sync',
            blendMode: 'Layer',
            members: [
                { uuid: 'm1', stripUuid: '13120111-0184-4961-9e74-018a960d4b32', inverted: false, poolIndex: 0, inUse: true },
                { uuid: 'm2', stripUuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf391a', inverted: false, poolIndex: 1, inUse: true },
            ],
            inUse: true,
        },
    ];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getPools(): Promise<IStripPool[]> {
        await this.delay(300);
        return this.pools.map(p => ({ ...p, members: [...p.members] }));
    }

    async getPool(uuid: string): Promise<IStripPool> {
        await this.delay(200);
        const p = this.pools.find(p => p.uuid === uuid);
        if (!p) throw new Error(`Pool not found: ${uuid}`);
        return { ...p, members: [...p.members] };
    }

    async createPool(data: IStripPoolMutation): Promise<string> {
        await this.delay(300);
        const newPool: IStripPool = {
            uuid: 'mock-pool-' + Math.floor(Math.random() * 10000),
            name: data.name,
            poolType: data.poolType,
            blendMode: data.blendMode ?? 'Layer',
            members: [],
            inUse: false
        };
        this.pools.push(newPool);
        return newPool.uuid;
    }

    async updatePool(uuid: string, data: Partial<IStripPoolMutation>): Promise<void> {
        await this.delay(200);
        const i = this.pools.findIndex(p => p.uuid === uuid);
        if (i === -1) return;
        this.pools[i] = {
            ...this.pools[i],
            name: data.name ?? this.pools[i].name,
            poolType: data.poolType ?? this.pools[i].poolType,
            blendMode: data.blendMode ?? this.pools[i].blendMode,
        };
    }

    async updatePoolMembers(uuid: string, members: IStripPoolMember[]): Promise<void> {
        await this.delay(200);
        const i = this.pools.findIndex(p => p.uuid === uuid);
        if (i === -1) return;
        this.pools[i] = {
            ...this.pools[i],
            members: members.map((m, idx) => ({
                uuid: m.uuid ?? `mock-member-${Date.now()}-${idx}`,
                stripUuid: m.stripUuid,
                inverted: m.inverted,
                poolIndex: m.poolIndex,
                inUse: m.inUse,
            })),
        };
    }

    async deletePool(uuid: string): Promise<void> {
        await this.delay(200);
        this.pools = this.pools.filter(p => p.uuid !== uuid);
    }
}
