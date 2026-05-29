import type { IEffectReassign, IEffectSchema, ILightEffect, ILightEffectMutation, LightEffectStatusCommand } from './effects_api';

export interface IEffectsApi {
  getEffects(): Promise<ILightEffect[]>;
  getEffectsByStrip(stripUuid: string): Promise<ILightEffect[]>;
  getEffectsByPool(poolUuid: string): Promise<ILightEffect[]>;
  createEffect(data: ILightEffectMutation): Promise<string>;
  updateEffect(uuid: string, data: Partial<ILightEffectMutation>): Promise<void>;
  reassignEffect(uuid: string, data: IEffectReassign): Promise<void>;
  deleteEffect(uuid: string): Promise<void>;
  updateEffectStatus(uuids: string[], command: LightEffectStatusCommand): Promise<void>;
  getEffectSchemas(): Promise<IEffectSchema[]>;
}
