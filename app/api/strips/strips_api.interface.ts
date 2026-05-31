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
    // Detaches the strip from its client. Must not be sent with a non-null
    // clientUuid — the server returns 400.
    unassign?: boolean;
  }): Promise<void>;
  deleteStrip(uuid: string): Promise<void>;
}