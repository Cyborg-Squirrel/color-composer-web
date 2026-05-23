import type { IStripPool, IStripPoolMember, IStripPoolMutation } from './pools_api';
import type { IPoolsApi } from './pools_api.interface';

export class RealPoolsApi implements IPoolsApi {
  private apiUrl: string | null = null;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || null;
  }

  async getPools(): Promise<IStripPool[]> {
    if (!this.apiUrl) return [];
    const res = await fetch(this.apiUrl + '/pool');
    if (!res.ok) throw new Error(`Failed to fetch pools: ${res.status}`);
    const json = await res.json();
    return (json.pools ?? []).map((p: IStripPool) => p);
  }

  async getPool(uuid: string): Promise<IStripPool> {
    if (!this.apiUrl) throw new Error('API_URL not set');
    const res = await fetch(this.apiUrl + '/pool/' + uuid);
    if (!res.ok) throw new Error(`Failed to fetch pool: ${res.status}`);
    return res.json();
  }

  async createPool(data: IStripPoolMutation): Promise<string> {
    if (!this.apiUrl) return '';
    const res = await fetch(this.apiUrl + '/pool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        poolType: data.poolType,
        blendMode: data.blendMode,
      }),
    });
    if (!res.ok) throw new Error(`Failed to create pool: ${res.status}`);
    const json = await res.json();
    return json.uuid;
  }

  async updatePool(uuid: string, data: Partial<IStripPoolMutation>): Promise<void> {
    if (!this.apiUrl) return;
    const res = await fetch(this.apiUrl + '/pool/' + uuid, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update pool: ${res.status}`);
  }

  async updatePoolMembers(uuid: string, members: IStripPoolMember[]): Promise<void> {
    if (!this.apiUrl) return;
    const res = await fetch(this.apiUrl + '/pool/' + uuid + '/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members }),
    });
    if (!res.ok) throw new Error(`Failed to update pool members: ${res.status}`);
  }

  async deletePool(uuid: string): Promise<void> {
    if (!this.apiUrl) return;
    const res = await fetch(this.apiUrl + '/pool/' + uuid, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete pool: ${res.status}`);
  }
}
