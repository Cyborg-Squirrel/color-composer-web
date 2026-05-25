import type { ILightEffectSettings, ILightEffectSettingsMutation } from './effect_settings_api';

export interface IEffectSettingsApi {
  getEffectSettings(): Promise<ILightEffectSettings[]>;
  createEffectSettings(data: ILightEffectSettingsMutation): Promise<string>;
  updateEffectSettings(uuid: string, data: Partial<ILightEffectSettingsMutation>): Promise<void>;
  deleteEffectSettings(uuid: string): Promise<void>;
}
