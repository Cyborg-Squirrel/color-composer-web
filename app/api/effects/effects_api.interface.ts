import type { ILightEffect, ILightEffectMutation, LightEffectStatusCommand } from './effects_api';

export interface IEffectsApi {
  getEffects(): Promise<ILightEffect[]>;
  getEffectsByStrip(stripUuid: string): Promise<ILightEffect[]>;
  getEffectsByPool(poolUuid: string): Promise<ILightEffect[]>;
  createEffect(data: ILightEffectMutation): Promise<string>;
  updateEffect(uuid: string, data: Partial<ILightEffectMutation>): Promise<void>;
  deleteEffect(uuid: string): Promise<void>;
  updateEffectStatus(uuids: string[], command: LightEffectStatusCommand): Promise<void>;
}
