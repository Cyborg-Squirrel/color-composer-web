export type LightEffectStatus = 'Idle' | 'Playing' | 'Paused' | 'Stopped';
export type LightEffectStatusCommand = 'Play' | 'Pause' | 'Stop';

export interface ILightEffect {
    uuid: string;
    name: string;
    type: string;
    stripUuid?: string;
    poolUuid?: string;
    paletteUuid?: string | null;
    settings: Record<string, unknown>;
    status: LightEffectStatus;
}

export interface ILightEffectMutation {
    name: string;
    effectType: string;
    stripUuid?: string;
    poolUuid?: string;
    settings?: Record<string, unknown>;
    paletteUuid?: string | null;
}

export type { IEffectsApi } from './effects_api.interface';
export { MockEffectsApi } from './effects_api.mock';
export { RealEffectsApi } from './effects_api.real';

