import type { BlendMode, ILedStrip } from './strips_api';
import type { IStripsApi } from './strips_api.interface';

export class MockStripsApi implements IStripsApi {
  private strips: ILedStrip[] = [
    {
      name: 'Hallway Strip',
      uuid: '13120111-0184-4961-9e74-018a960d4b32',
      clientUuid: '0efcbf1f-9766-4d60-8b9b-edc4df639998',
      pin: 'D10',
      length: 120,
      height: 1,
      brightness: 20,
      blendMode: 'Additive',
      activeEffects: 2,
    },
    {
      name: 'LED Lamp Strip',
      uuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf391a',
      clientUuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf3911',
      pin: 'D12',
      length: 80,
      height: 1,
      brightness: 34,
      blendMode: 'Layer',
      activeEffects: 0,
    }
  ];

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getStrips(): Promise<ILedStrip[]> {
    // Artificial delay before returning mock content
    await this.delay(500);
    return [...this.strips];
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
    // Artificial delay before returning mock content
    await this.delay(500);
    
    const newStrip: ILedStrip = {
      name: data.name,
      uuid: 'mock-uuid-' + Math.floor(Math.random() * 10000),
      clientUuid: data.clientUuid,
      pin: data.pin,
      length: data.length,
      height: data.height || 1,
      brightness: data.brightness || 100,
      blendMode: data.blendMode || 'Additive',
      activeEffects: 0,
    };

    this.strips.push(newStrip);
    return newStrip.uuid;
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
    // Artificial delay before returning mock content
    await this.delay(500);
    
    const index = this.strips.findIndex(strip => strip.uuid === uuid);
    if (index !== -1) {
      this.strips[index] = {
        ...this.strips[index],
        ...data
      };
    }
  }
}