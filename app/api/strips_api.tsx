
export const piPins: PiPin[] = ['D10', 'D12', 'D18', 'D21'];
export type PiPin = 'D10' | 'D12' | 'D18' | 'D21';

export type BlendMode = 'Additive' | 'Average' | 'Layer' | 'UseHighest';
export const blendModes: BlendMode[] = ['Additive', 'Average', 'Layer', 'UseHighest'];

export interface ILedStrip {
    name: string;
    uuid: string;
    clientUuid: string;
    pin?: string | null;
    length: number;
    height: number;
    brightness: number;
    blendMode: BlendMode;
    activeEffects: number;
}


export type { IStripsApi } from './strips_api.interface';
export { MockStripsApi } from './strips_api.mock';
export { RealStripsApi } from './strips_api.real';

