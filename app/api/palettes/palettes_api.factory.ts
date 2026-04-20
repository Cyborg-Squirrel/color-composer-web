import type { IPalettesApi } from './palettes_api.interface';
import { MockPalettesApi } from './palettes_api.mock';
import { RealPalettesApi } from './palettes_api.real';

export class PalettesApiFactory {
  static create(): IPalettesApi {
    const mockMode = import.meta.env.VITE_MOCK_MODE;

    if (mockMode === 'true') {
      return new MockPalettesApi();
    }

    return new RealPalettesApi();
  }
}
