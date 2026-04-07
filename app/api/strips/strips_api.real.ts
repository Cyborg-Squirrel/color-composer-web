import type { BlendMode, ILedStrip } from './strips_api';
import type { IStripsApi } from './strips_api.interface';

export class RealStripsApi implements IStripsApi {
  private apiUrl: string | null = null;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || null;
  }

  async getStrips(): Promise<ILedStrip[]> {
    if (this.apiUrl && import.meta.env.VITE_MOCK_MODE !== 'true') {
      const res = await fetch(this.apiUrl + '/strip');
      const json = await res.json();
      const stripList = json.strips.map((s: ILedStrip) => s);
      return stripList;
    } else {
      if (!this.apiUrl) {
        console.log('API_URL environment variable is not set. ' +
          'See https://vite.dev/guide/env-and-mode ' +
          'on how to configure environment variables.');
      }
      // Return empty array in mock mode
      return [];
    }
  }

  async createStrip(data: {
    clientUuid: string;
    name: string;
    pin: string;
    length: number;
    height?: number;
    brightness?: number;
    blendMode?: BlendMode;
  }): Promise<string> {
    if (this.apiUrl && import.meta.env.VITE_MOCK_MODE !== 'true') {
      const res = await fetch(this.apiUrl + '/strip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create strip: ${res.status}`);
      const json = await res.json();
      return json.uuid;
    } else {
      if (!this.apiUrl) {
        console.log('API_URL environment variable is not set. ' +
          'See https://vite.dev/guide/env-and-mode ' +
          'on how to configure environment variables.');
      }
      // Return a mock UUID in mock mode
      return 'mock-uuid-' + Math.floor(Math.random() * 10000);
    }
  }

  async updateStrip(uuid: string, data: {
    name?: string;
    pin?: string;
    length?: number;
    height?: number;
    brightness?: number;
    blendMode?: BlendMode;
    clientUuid?: string;
  }): Promise<void> {
    if (this.apiUrl && import.meta.env.VITE_MOCK_MODE !== 'true') {
      const res = await fetch(this.apiUrl + '/strip/' + uuid, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update strip: ${res.status}`);
    } else {
      if (!this.apiUrl) {
        console.log('API_URL environment variable is not set. ' +
          'See https://vite.dev/guide/env-and-mode ' +
          'on how to configure environment variables.');
      }
      // No-op in mock mode
    }
  }
}