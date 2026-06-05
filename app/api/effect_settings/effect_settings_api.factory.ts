import type { IEffectSettingsApi } from './effect_settings_api.interface';
import { MockEffectSettingsApi } from './effect_settings_api.mock';
import { RealEffectSettingsApi } from './effect_settings_api.real';

export class EffectSettingsApiFactory {
  static create(): IEffectSettingsApi {
    const mockMode = import.meta.env.VITE_MOCK_MODE;

    if (mockMode === 'true') {
      return new MockEffectSettingsApi();
    }

    return new RealEffectSettingsApi();
  }
}
