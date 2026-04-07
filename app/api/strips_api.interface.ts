import type { BlendMode, ILedStrip } from './strips_api';

export interface IStripsApi {
  getStrips(): Promise<ILedStrip[]>;
  createStrip(data: {
    clientUuid: string;
    name: string;
    pin: string;
    length: number;
    height?: number;
    brightness?: number;
    blendMode?: BlendMode;
  }): Promise<string>;
  updateStrip(uuid: string, data: {
    name?: string;
    pin?: string | null;
    length?: number;
    height?: number;
    brightness?: number;
    blendMode?: BlendMode;
    clientUuid?: string;
  }): Promise<void>;
}