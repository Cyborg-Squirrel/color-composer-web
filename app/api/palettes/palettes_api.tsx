export interface IPalette {
    uuid: string;
    name: string;
    type: string;
    settings: Record<string, unknown>;
}

export interface IPaletteMutation {
    name: string;
    paletteType: string;
    settings?: Record<string, unknown>;
}

export type { IPalettesApi } from './palettes_api.interface';
export { MockPalettesApi } from './palettes_api.mock';
export { RealPalettesApi } from './palettes_api.real';

