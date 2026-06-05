export interface ILightEffectSettings {
    uuid: string;
    type: string;
    name: string;
    settings: Record<string, unknown>;
    isDefault: boolean;
    /** When true, the renderer skips frames whose output is entirely blank. */
    skipFramesIfBlank: boolean;
}

export interface ILightEffectSettingsMutation {
    type: string;
    name: string;
    settings?: Record<string, unknown>;
    isDefault?: boolean;
    /** Optional; defaults to true on creation if omitted. */
    skipFramesIfBlank?: boolean;
}

export type { IEffectSettingsApi } from './effect_settings_api.interface';
export { MockEffectSettingsApi } from './effect_settings_api.mock';
export { RealEffectSettingsApi } from './effect_settings_api.real';
