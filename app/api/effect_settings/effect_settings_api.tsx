export interface ILightEffectSettings {
    uuid: string;
    type: string;
    name: string;
    settings: Record<string, unknown>;
    isDefault: boolean;
}

export interface ILightEffectSettingsMutation {
    type: string;
    name: string;
    settings?: Record<string, unknown>;
    isDefault?: boolean;
}

export type { IEffectSettingsApi } from './effect_settings_api.interface';
export { MockEffectSettingsApi } from './effect_settings_api.mock';
export { RealEffectSettingsApi } from './effect_settings_api.real';
