export enum LightEffectStatus {
    Inactive = 'Inactive',
    Playing = 'Playing',
    Paused = 'Paused',
    Stopped = 'Stopped',
}
export type LightEffectStatusCommand = 'Play' | 'Pause' | 'Stop' | 'Deactivate';

/** Derived from `type` per API.md. */
export type EffectCategory = 'Static' | 'Ambient' | 'Motion';

export type EffectCategoryFilter = EffectCategory | 'All';

export const EFFECT_CATEGORIES: readonly EffectCategoryFilter[] = ['All', 'Static', 'Ambient', 'Motion'] as const;

export interface ILightEffect {
    uuid: string;
    name: string;
    type: string;
    category?: EffectCategory;
    stripUuid?: string | null;
    poolUuid?: string | null;
    paletteUuid?: string | null;
    settings: Record<string, unknown>;
    status: LightEffectStatus;
}

export interface ILightEffectMutation {
    name: string;
    effectType: string;
    stripUuid?: string | null;
    poolUuid?: string | null;
    settings?: Record<string, unknown>;
    paletteUuid?: string | null;
}

/* ───────────────────────── Effect Settings Schemas ──────────────────────
 * Per API.md `GET /effect/schemas`: each effect type advertises its expected
 * settings keys, their value types, and a list of polymorphic validators.
 *
 * Validators carry a `type` discriminator:
 *   - { type: 'min',     value: number   }   value ≥ value
 *   - { type: 'max',     value: number   }   value ≤ value
 *   - { type: 'options', values: string[] }  value must be one of values
 *
 * `RgbColor` is part of `EffectSettingsType` per the EffectSettingsType enum
 * in API.md; the schemas example only enumerated four — we accept all five.
 */
export type EffectSettingsType = 'Boolean' | 'Integer' | 'Number' | 'String' | 'RgbColor';

export type EffectFieldValidator =
    | { type: 'min'; value: number }
    | { type: 'max'; value: number }
    | { type: 'options'; values: string[] };

export interface IEffectSchemaField {
    key: string;
    type: EffectSettingsType;
    validators: EffectFieldValidator[];
    description: string;
}

export interface IEffectSchema {
    effectName: string;
    category: EffectCategory;
    fields: IEffectSchemaField[];
}

export type { IEffectsApi } from './effects_api.interface';
export { MockEffectsApi } from './effects_api.mock';
export { RealEffectsApi } from './effects_api.real';

/* ───────────────────────── Schema lookup helpers ───────────────────────── */

export function findSchema(schemas: IEffectSchema[], effectType: string | null | undefined): IEffectSchema | undefined {
    if (!effectType) return undefined;
    return schemas.find((s) => s.effectName === effectType);
}

export function validatorOfType<T extends EffectFieldValidator['type']>(
    field: IEffectSchemaField,
    type: T,
): Extract<EffectFieldValidator, { type: T }> | undefined {
    return field.validators.find((v) => v.type === type) as Extract<EffectFieldValidator, { type: T }> | undefined;
}
