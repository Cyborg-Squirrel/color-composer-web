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
    settingsUuid?: string | null;
    status: LightEffectStatus;
}

export interface ILightEffectMutation {
    name: string;
    effectType: string;
    stripUuid?: string | null;
    poolUuid?: string | null;
    settingsUuid?: string | null;
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
    default: boolean | number | string | null;
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

/* ───────────────────────── Validation ───────────────────────── */

/**
 * Validate a single field value against its schema validators.
 * Returns an error message if invalid, or null if valid.
 *
 * A missing value (undefined, null, or '') is considered valid — the user
 * opted not to set this field, and the backend applies its own default.
 */
export function validateField(field: IEffectSchemaField, value: unknown): string | null {
    if (value === undefined || value === null || value === '') return null;

    switch (field.type) {
        case 'Integer':
        case 'Number': {
            if (typeof value !== 'number' || !Number.isFinite(value)) {
                return 'Must be a number';
            }
            if (field.type === 'Integer' && !Number.isInteger(value)) {
                return 'Must be an integer';
            }
            const min = validatorOfType(field, 'min')?.value;
            const max = validatorOfType(field, 'max')?.value;
            if (typeof min === 'number' && value < min) return `Must be ≥ ${min}`;
            if (typeof max === 'number' && value > max) return `Must be ≤ ${max}`;
            return null;
        }
        case 'String': {
            if (typeof value !== 'string') return 'Must be a string';
            const options = validatorOfType(field, 'options')?.values;
            if (options && options.length > 0 && !options.includes(value)) {
                return `Must be one of: ${options.join(', ')}`;
            }
            return null;
        }
        case 'Boolean':
            return typeof value === 'boolean' ? null : 'Must be true or false';
        case 'RgbColor':
            return typeof value === 'string' ? null : 'Must be a color string';
        default:
            return null;
    }
}

/** Validate an entire settings object. Returns a map of field key → error message (only invalid fields included). */
export function validateSettings(
    schema: IEffectSchemaField[],
    settings: Record<string, unknown>,
): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of schema) {
        const err = validateField(field, settings[field.key]);
        if (err) errors[field.key] = err;
    }
    return errors;
}

/**
 * Build a settings object pre-populated with each field's `default` value.
 * Fields whose `default` is `null` are omitted so the backend can apply its own default.
 */
export function defaultParamsForFields(fields: IEffectSchemaField[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const field of fields) {
        if (field.default !== null) {
            result[field.key] = field.default;
        }
    }
    return result;
}
