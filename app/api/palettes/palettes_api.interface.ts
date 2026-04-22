import type { IPalette, IPaletteMutation } from './palettes_api';

export interface IPalettesApi {
  getPalettes(): Promise<IPalette[]>;
  getPalette(uuid: string): Promise<IPalette>;
  createPalette(data: IPaletteMutation): Promise<string>;
  updatePalette(uuid: string, data: Partial<IPaletteMutation>): Promise<void>;
  deletePalette(uuid: string): Promise<void>;
}
