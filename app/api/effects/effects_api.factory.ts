import type { IEffectsApi } from './effects_api.interface';
import { MockEffectsApi } from './effects_api.mock';
import { RealEffectsApi } from './effects_api.real';

export class EffectsApiFactory {
  static create(): IEffectsApi {
    const mockMode = import.meta.env.VITE_MOCK_MODE;

    if (mockMode === 'true') {
      return new MockEffectsApi();
    }

    return new RealEffectsApi();
  }
}
